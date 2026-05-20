"""
Tests for authentication endpoints:
  POST /api/auth/login
  POST /api/auth/register
  POST /api/auth/refresh
  POST /api/auth/logout
  POST /api/auth/forgot-password
"""
import pytest
import pytest_asyncio


pytestmark = pytest.mark.asyncio


class TestLogin:
    async def test_login_success(self, client, seeded_users):
        response = await client.post("/api/auth/login", json={
            "email": "admin@test.com",
            "password": "Admin@1234"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    async def test_login_wrong_password(self, client):
        response = await client.post("/api/auth/login", json={
            "email": "admin@test.com",
            "password": "WrongPassword"
        })
        assert response.status_code == 401

    async def test_login_nonexistent_user(self, client):
        response = await client.post("/api/auth/login", json={
            "email": "ghost@test.com",
            "password": "SomePass123"
        })
        assert response.status_code == 401

    async def test_login_invalid_email_format(self, client):
        response = await client.post("/api/auth/login", json={
            "email": "not-an-email",
            "password": "SomePass123"
        })
        assert response.status_code == 422  # Pydantic validation error

    async def test_login_empty_body(self, client):
        response = await client.post("/api/auth/login", json={})
        assert response.status_code == 422


class TestRegister:
    async def test_register_success(self, client, seeded_roles):
        response = await client.post("/api/auth/register", json={
            "name": "New User",
            "email": "newuser@test.com",
            "password": "NewUser@1234",
            "role_id": str(seeded_roles["staff"].id)
        })
        assert response.status_code in (200, 201)
        data = response.json()
        assert data["email"] == "newuser@test.com"
        assert "hashed_password" not in data  # Never expose password

    async def test_register_duplicate_email(self, client, seeded_roles):
        payload = {
            "name": "Duplicate",
            "email": "admin@test.com",  # Already seeded
            "password": "Dup@12345",
            "role_id": str(seeded_roles["staff"].id)
        }
        response = await client.post("/api/auth/register", json=payload)
        assert response.status_code == 400

    async def test_register_weak_password(self, client, seeded_roles):
        response = await client.post("/api/auth/register", json={
            "name": "Weak Pass",
            "email": "weak@test.com",
            "password": "123",
            "role_id": str(seeded_roles["viewer"].id)
        })
        assert response.status_code == 422

    async def test_register_missing_fields(self, client):
        response = await client.post("/api/auth/register", json={"name": "Only Name"})
        assert response.status_code == 422


class TestTokenRefresh:
    async def test_refresh_success(self, client, seeded_users):
        # First login to get tokens
        login_resp = await client.post("/api/auth/login", json={
            "email": "staff@test.com",
            "password": "Staff@1234"
        })
        assert login_resp.status_code == 200
        refresh_token = login_resp.json()["refresh_token"]

        refresh_resp = await client.post("/api/auth/refresh", json={
            "refresh_token": refresh_token
        })
        assert refresh_resp.status_code == 200
        assert "access_token" in refresh_resp.json()

    async def test_refresh_invalid_token(self, client):
        response = await client.post("/api/auth/refresh", json={
            "refresh_token": "not.a.valid.jwt.token"
        })
        assert response.status_code == 401

    async def test_refresh_missing_token(self, client):
        response = await client.post("/api/auth/refresh", json={})
        assert response.status_code == 422


class TestLogout:
    async def test_logout_success(self, client, admin_headers):
        response = await client.post("/api/auth/logout", headers=admin_headers)
        assert response.status_code == 200

    async def test_logout_without_token(self, client):
        response = await client.post("/api/auth/logout")
        assert response.status_code == 401


class TestForgotPassword:
    async def test_forgot_password_known_email(self, client):
        response = await client.post("/api/auth/forgot-password", json={
            "email": "admin@test.com"
        })
        # Should always return 200 to prevent user enumeration
        assert response.status_code == 200

    async def test_forgot_password_unknown_email(self, client):
        response = await client.post("/api/auth/forgot-password", json={
            "email": "unknownghost@test.com"
        })
        # Same 200 response — don't reveal whether email exists
        assert response.status_code == 200

    async def test_forgot_password_invalid_email(self, client):
        response = await client.post("/api/auth/forgot-password", json={
            "email": "not-an-email"
        })
        assert response.status_code == 422

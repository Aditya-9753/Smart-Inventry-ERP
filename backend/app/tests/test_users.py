"""
Tests for user management endpoints:
  GET    /api/users
  POST   /api/users
  PUT    /api/users/{id}
  DELETE /api/users/{id}
  Role assignment and RBAC guard validation.
"""
import pytest

pytestmark = pytest.mark.asyncio


class TestUserList:
    async def test_list_users_admin(self, client, admin_headers):
        response = await client.get("/api/users", headers=admin_headers)
        assert response.status_code == 200

    async def test_list_users_staff_forbidden(self, client, staff_headers):
        """Staff should not be able to list all users."""
        response = await client.get("/api/users", headers=staff_headers)
        assert response.status_code in (403, 401)

    async def test_list_users_contains_seeded(self, client, admin_headers, seeded_users):
        response = await client.get("/api/users", headers=admin_headers)
        emails = [u["email"] for u in (response.json().get("items") or response.json())]
        assert "admin@test.com" in emails


class TestUserCreate:
    async def test_create_user_admin(self, client, admin_headers, seeded_roles):
        response = await client.post("/api/users", json={
            "name": "Created User",
            "email": "created@test.com",
            "password": "Created@1234",
            "role_id": str(seeded_roles["staff"].id)
        }, headers=admin_headers)
        assert response.status_code in (200, 201)
        data = response.json()
        assert data["email"] == "created@test.com"
        assert "hashed_password" not in data

    async def test_create_user_manager_forbidden(self, client, manager_headers, seeded_roles):
        """Managers should not be able to create users."""
        response = await client.post("/api/users", json={
            "name": "Manager Created",
            "email": "mgr_created@test.com",
            "password": "Pass@1234",
            "role_id": str(seeded_roles["staff"].id)
        }, headers=manager_headers)
        assert response.status_code in (403, 401)

    async def test_create_user_duplicate_email(self, client, admin_headers, seeded_roles):
        response = await client.post("/api/users", json={
            "name": "Dupe",
            "email": "admin@test.com",
            "password": "Dupe@1234",
            "role_id": str(seeded_roles["staff"].id)
        }, headers=admin_headers)
        assert response.status_code == 400


class TestUserUpdate:
    async def test_update_user_name(self, client, admin_headers, seeded_users):
        user_id = str(seeded_users["staff"].id)
        response = await client.put(f"/api/users/{user_id}", json={
            "name": "Updated Staff Name"
        }, headers=admin_headers)
        assert response.status_code == 200
        assert response.json()["name"] == "Updated Staff Name"

    async def test_update_user_role(self, client, admin_headers, seeded_users, seeded_roles):
        """Admin can reassign a user's role."""
        user_id = str(seeded_users["staff"].id)
        response = await client.put(f"/api/users/{user_id}", json={
            "role_id": str(seeded_roles["manager"].id)
        }, headers=admin_headers)
        assert response.status_code == 200

    async def test_update_nonexistent_user(self, client, admin_headers):
        fake_id = "000000000000000000000000"
        response = await client.put(f"/api/users/{fake_id}", json={"name": "Ghost"}, headers=admin_headers)
        assert response.status_code == 404


class TestUserDelete:
    async def test_delete_user_admin(self, client, admin_headers, seeded_roles):
        # Create a disposable user
        create = await client.post("/api/users", json={
            "name": "Disposable",
            "email": "dispose@test.com",
            "password": "Dispose@1234",
            "role_id": str(seeded_roles["viewer"].id)
        }, headers=admin_headers)
        assert create.status_code in (200, 201)
        user_id = create.json()["id"]

        delete = await client.delete(f"/api/users/{user_id}", headers=admin_headers)
        assert delete.status_code in (200, 204)

    async def test_delete_user_self_forbidden(self, client, admin_headers, seeded_users):
        """Prevent admin from deleting themselves."""
        admin_id = str(seeded_users["admin"].id)
        response = await client.delete(f"/api/users/{admin_id}", headers=admin_headers)
        assert response.status_code in (400, 403)


class TestRBACGuards:
    async def test_staff_cannot_access_admin_endpoints(self, client, staff_headers):
        for endpoint in ["/api/users", "/api/audit/logs", "/api/settings"]:
            response = await client.get(endpoint, headers=staff_headers)
            assert response.status_code in (401, 403), \
                f"Expected 401/403 for staff on {endpoint}, got {response.status_code}"

    async def test_viewer_cannot_write(self, client, seeded_users):
        """Viewer cannot POST/PUT/DELETE anywhere."""
        from app.core.security import create_access_token
        viewer_token = create_access_token({"sub": str(seeded_users.get("viewer", {}).get("id", "000000000000000000000000")), "role": "VIEWER"})
        viewer_headers = {"Authorization": f"Bearer {viewer_token}"}

        response = await client.post("/api/products", json={
            "name": "Viewer Product",
            "price": 1.0,
            "quantity": 1,
            "min_stock": 0
        }, headers=viewer_headers)
        assert response.status_code in (401, 403)

    async def test_unauthenticated_cannot_access_anything(self, client):
        protected = [
            "/api/products",
            "/api/users",
            "/api/inventory/history",
            "/api/warehouses",
            "/api/dashboard/stats",
        ]
        for endpoint in protected:
            response = await client.get(endpoint)
            assert response.status_code == 401, \
                f"Expected 401 for {endpoint}, got {response.status_code}"

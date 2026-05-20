import urllib.request
import json

data = json.dumps({'name':'Test User', 'email':'testuser@example.com', 'password':'Test@1234'}).encode()
req = urllib.request.Request('http://127.0.0.1:8000/api/auth/register', data=data, headers={'Content-Type': 'application/json'})
try:
    resp = urllib.request.urlopen(req)
    print("SUCCESS:", resp.read().decode())
except Exception as e:
    print("ERROR:", e.read().decode() if hasattr(e, 'read') else str(e))

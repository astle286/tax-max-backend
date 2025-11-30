from functools import wraps
from flask import request, jsonify, g
from .utils import decode_token  # Ensure this import points to your JWT decode helper


def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", None)
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid token"}), 401

        token = auth_header.split(" ")[1]
        try:
            payload = decode_token(token)
            g.user = {
                "id": payload["sub"],
                "username": payload["username"],
                "role": payload["role"]
            }
        except ValueError as e:
            return jsonify({"error": str(e)}), 401

        return f(*args, **kwargs)
    return decorated


def require_role(*roles):
    '''Decorator to enforce role-based access.
    Accepts one or multiple roles:
        @require_role("admin")
        @require_role("admin", "staff")
    '''
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            user = getattr(g, "user", None)
            if not user or user.get("role") not in roles:
                return jsonify({"error": "Forbidden: insufficient role"}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator

from flask import Blueprint, request, jsonify, g
from .models import User
from .extensions import db
from . import bcrypt
from .utils import generate_token  # JWT helper
from .auth_helpers import require_auth, require_role

auth_bp = Blueprint('auth', __name__, url_prefix="/auth")

@auth_bp.route("/")
def index():
    return "Auth Service is running!"

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "Username and password required"}), 400

    # Check if user already exists
    if User.query.filter_by(username=data["username"]).first():
        return jsonify({"error": "User already exists"}), 409

    hashed_pw = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    user = User(
        username=data["username"],
        password_hash=hashed_pw,
        role=data.get("role", "viewer")
    )
    db.session.add(user)
    db.session.commit()

    # Return token + role so frontend can redirect immediately
    token = generate_token(user)
    return jsonify({
        "message": "User registered",
        "token": token,
        "role": user.role
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    token = generate_token(user)
    return jsonify({
        "token": token,
        "role": user.role
    })

@auth_bp.route("/protected", methods=["GET"])
@require_auth
def protected():
    user = getattr(g, "user", None)
    if not user:
        return jsonify({"error": "User not found in token"}), 401

    return jsonify({
        "message": f"Hello {user['username']}! You are a {user['role']}."
    })

@auth_bp.route("/admin-only", methods=["GET"])
@require_auth
@require_role("admin")
def admin_only():
    return jsonify({"message": f"Welcome, {g.user['username']}! You have admin access."})

@auth_bp.route("/admin-dashboard", methods=["GET"])
@require_auth
@require_role("admin")
def admin_dashboard():
    return jsonify({"message": "Welcome to the admin dashboard!"})

@auth_bp.route("/app", methods=["GET"])
@require_auth
@require_role("admin", "staff")
def app_view():
    return jsonify({"message": f"Welcome {g.user['username']} to the app!"})

@auth_bp.route("/viewer", methods=["GET"])
@require_auth
@require_role("viewer")
def viewer_view():
    return jsonify({"message": f"Hello {g.user['username']}, here are your details."})

@auth_bp.route("/users", methods=["GET"])
@require_auth
@require_role("admin")
def get_users():
    users = User.query.all()
    return jsonify([
        {"id": u.id, "username": u.username, "role": u.role}
        for u in users
    ])

@auth_bp.route("/users/<username>/password", methods=["PUT"])
@require_auth
@require_role("admin")
def update_password(username):
    data = request.get_json()
    new_pw = data.get("password")
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({"error": "User not found"}), 404
    user.password_hash = bcrypt.generate_password_hash(new_pw).decode("utf-8")
    db.session.commit()
    return jsonify({"message": "Password updated"})

@auth_bp.route("/users/<username>/activity", methods=["GET"])
@require_auth
@require_role("admin")
def user_activity(username):
    # Example: return last 7 days of activity counts
    dummy_data = [
        {"date": "2025-11-18", "logins": 2, "updates": 1, "deletions": 0},
        {"date": "2025-11-19", "logins": 5, "updates": 2, "deletions": 1},
        {"date": "2025-11-20", "logins": 3, "updates": 0, "deletions": 0},
        {"date": "2025-11-21", "logins": 4, "updates": 1, "deletions": 2},
    ]
    return jsonify(dummy_data)

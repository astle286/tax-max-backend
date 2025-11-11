from flask import Blueprint, request, jsonify
from .models import db, Family, Member, Group
from datetime import datetime
from .models import User
from . import db, bcrypt

family_bp = Blueprint('family', __name__)
auth_bp = Blueprint('auth', __name__)

@family_bp.route("/")
def index():
    return "Family Service is running!"

@family_bp.route("/family", methods=["POST"])
def create_family():
    data = request.get_json()
    family = Family(family_number=data["family_number"], group_id=data.get("group_id"))
    db.session.add(family)
    db.session.commit()
    return jsonify({"message": "Family created", "id": family.id}), 201

@family_bp.route("/member", methods=["POST"])
def add_member():
    data = request.get_json()
    dob = datetime.strptime(data["dob"], "%Y-%m-%d").date()
    member = Member(name=data["name"], dob=dob, sex=data["sex"], family_id=data["family_id"])
    db.session.add(member)
    db.session.commit()
    return jsonify({"message": "Member added", "id": member.id}), 201

@family_bp.route("/group", methods=["POST"])
def create_group():
    data = request.get_json()
    group = Group(name=data["name"])
    db.session.add(group)
    db.session.commit()
    return jsonify({"message": "Group created", "id": group.id}), 201

@family_bp.route("/search", methods=["GET"])
def search_family():
    query = request.args.get("q")
    families = Family.query.filter(Family.family_number.ilike(f"%{query}%")).all()
    results = [{"id": f.id, "family_number": f.family_number} for f in families]
    return jsonify(results)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    hashed_pw = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    user = User(username=data["username"], password=hashed_pw)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data["username"]).first()
    if user and bcrypt.check_password_hash(user.password, data["password"]):
        return jsonify({"message": "Login successful"}), 200
    return jsonify({"message": "Invalid credentials"}), 401
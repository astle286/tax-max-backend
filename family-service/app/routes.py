from flask import Blueprint, request, jsonify
from .models import Family, Member
from .extensions import db

family_bp = Blueprint("family", __name__, url_prefix="/family")

@family_bp.route("/", methods=["GET"])
def list_families():
    families = Family.query.all()
    return jsonify([{"id": f.id, "family_number": f.family_number} for f in families])

@family_bp.route("/", methods=["POST"])
def add_family():
    data = request.json
    family = Family(family_number=data["family_number"])
    db.session.add(family)
    db.session.commit()
    return jsonify({"id": family.id, "family_number": family.family_number}), 201

@family_bp.route("/member", methods=["POST"])
def add_member():
    data = request.json
    member = Member(
        name=data["name"],
        age=data["age"],
        gender=data["gender"],
        family_id=data["family_id"]
    )
    db.session.add(member)
    db.session.commit()
    return jsonify({"id": member.id, "name": member.name}), 201

@family_bp.route("/search", methods=["GET"])
def search_member():
    q = request.args.get("q", "")
    members = Member.query.filter(Member.name.ilike(f"%{q}%")).all()
    return jsonify([{"id": m.id, "name": m.name, "family_id": m.family_id} for m in members])

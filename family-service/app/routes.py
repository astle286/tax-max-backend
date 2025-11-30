from flask import Blueprint, request, jsonify
from .models import Family, Member
from .extensions import db

family_bp = Blueprint("family", __name__, url_prefix="/family")

@family_bp.route("/", methods=["GET"])
def index():
    return "Family Service is running!"

# ✅ List all families with member counts
@family_bp.route("/list", methods=["GET"])
def list_families():
    families = Family.query.all()
    return jsonify([
        {
            "id": f.id,
            "family_number": f.family_number,
            "group": f.group,
            "members": len(f.members)
        } for f in families
    ])

# ✅ Get full details of one family
@family_bp.route("/<int:family_id>", methods=["GET"])
def get_family(family_id):
    family = Family.query.get(family_id)
    if not family:
        return jsonify({"error": "Family not found"}), 404

    return jsonify({
        "id": family.id,
        "family_number": family.family_number,
        "group": family.group,
        "members": [
            {
                "id": m.id,
                "name": m.name,
                "gender": m.gender,
                "dob": m.dob,
                "role": m.role,
                "mobile": m.mobile,
                "email": m.email
            } for m in family.members
        ]
    })

# ✅ Create new family (cleaned up to POST /family)
@family_bp.route("", methods=["POST"])
def add_family():
    data = request.json or {}

    if not data.get("family_number"):
        return jsonify({"error": "family_number is required"}), 400

    # Prevent duplicates
    existing = Family.query.filter_by(family_number=data["family_number"]).first()
    if existing:
        return jsonify({"error": "family_number already exists"}), 409

    family = Family(
        family_number=data["family_number"],
        group=data.get("group")
    )
    db.session.add(family)
    db.session.commit()
    return jsonify({"id": family.id, "family_number": family.family_number}), 201

# ✅ Update family
@family_bp.route("/<int:family_id>", methods=["PUT"])
def update_family(family_id):
    family = Family.query.get(family_id)
    if not family:
        return jsonify({"error": "Family not found"}), 404

    data = request.json or {}
    family.family_number = data.get("family_number", family.family_number)
    family.group = data.get("group", family.group)
    db.session.commit()
    return jsonify({"message": "Family updated"})

# ✅ Delete family
@family_bp.route("/<int:family_id>", methods=["DELETE"])
def delete_family(family_id):
    family = Family.query.get(family_id)
    if not family:
        return jsonify({"error": "Family not found"}), 404

    db.session.delete(family)
    db.session.commit()
    return jsonify({"message": "Family deleted"})

# ✅ Add member to family
@family_bp.route("/member", methods=["POST"])
def add_member():
    data = request.json or {}

    if not data.get("name"):
        return jsonify({"error": "name is required"}), 400
    if not data.get("family_id"):
        return jsonify({"error": "family_id is required"}), 400

    family = Family.query.get(data["family_id"])
    if not family:
        return jsonify({"error": "Family not found"}), 404

    member = Member(
        name=data["name"],
        gender=data.get("gender"),
        dob=data.get("dob"),
        role=data.get("role"),
        mobile=data.get("mobile"),
        email=data.get("email"),
        family_id=data["family_id"]
    )
    db.session.add(member)
    db.session.commit()
    return jsonify({"id": member.id, "name": member.name}), 201

# ✅ Update member
@family_bp.route("/member/<int:member_id>", methods=["PUT"])
def update_member(member_id):
    member = Member.query.get(member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404

    data = request.json or {}
    member.name = data.get("name", member.name)
    member.gender = data.get("gender", member.gender)
    member.dob = data.get("dob", member.dob)
    member.role = data.get("role", member.role)
    member.mobile = data.get("mobile", member.mobile)
    member.email = data.get("email", member.email)
    db.session.commit()
    return jsonify({"message": "Member updated"})

# ✅ Delete member
@family_bp.route("/member/<int:member_id>", methods=["DELETE"])
def delete_member(member_id):
    member = Member.query.get(member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404

    db.session.delete(member)
    db.session.commit()
    return jsonify({"message": "Member deleted"})

# ✅ Search members by name
@family_bp.route("/search", methods=["GET"])
def search_member():
    q = request.args.get("q", "")
    if not q:
        return jsonify({"error": "Search query required"}), 400

    members = Member.query.filter(Member.name.ilike(f"%{q}%")).all()
    return jsonify([
        {
            "id": m.id,
            "name": m.name,
            "family_id": m.family_id,
            "role": m.role
        } for m in members
    ])

# ✅ Get full details of one member
@family_bp.route("/member/<int:member_id>", methods=["GET"])
def get_member(member_id):
    member = Member.query.get(member_id)
    if not member:
        return jsonify({"error": "Member not found"}), 404

    return jsonify({
        "id": member.id,
        "name": member.name,
        "gender": member.gender,
        "dob": member.dob,
        "role": member.role,
        "mobile": member.mobile,
        "email": member.email,
        "family_id": member.family_id
    })

from flask import Blueprint, request, jsonify
from .models import db, TaxPayment
from datetime import datetime
from flask import Blueprint


tax_bp = Blueprint('tax', __name__)

@tax_bp.route("/")
def index():
    return "Tax Service is running!"

@tax_bp.route("/tax", methods=["POST"])
def add_tax():
    data = request.get_json()
    date_received = datetime.strptime(data["date_received"], "%Y-%m-%d").date()
    tax = TaxPayment(
        member_name=data["member_name"],
        family_number=data["family_number"],
        date_received=date_received,
        mode=data["mode"],
        amount=data["amount"],
        reason=data.get("reason", "")
    )
    db.session.add(tax)
    db.session.commit()
    return jsonify({"message": "Tax recorded", "id": tax.id}), 201

@tax_bp.route("/tax/<int:id>", methods=["DELETE"])
def delete_tax(id):
    tax = TaxPayment.query.get_or_404(id)
    db.session.delete(tax)
    db.session.commit()
    return jsonify({"message": "Tax deleted"}), 200

@tax_bp.route("/tax/search", methods=["GET"])
def search_tax():
    query = request.args.get("q")
    results = TaxPayment.query.filter(
        TaxPayment.member_name.ilike(f"%{query}%")
    ).all()
    return jsonify([
        {
            "id": t.id,
            "member_name": t.member_name,
            "amount": t.amount,
            "date_received": t.date_received.isoformat()
        } for t in results
    ])

from flask import Blueprint, request, jsonify
from .models import db, Transaction
from datetime import datetime

tax_bp = Blueprint("tax", __name__, url_prefix="/tax")

@tax_bp.route("/")
def index():
    return "Tax Service is running!"

# ✅ Add a new transaction
@tax_bp.route("/transaction", methods=["POST"])
def add_transaction():
    data = request.get_json()
    tx_date = None
    if "date" in data:
        tx_date = datetime.strptime(data["date"], "%Y-%m-%d").date()

    transaction = Transaction(
        details=data.get("details", ""),
        amount=data["amount"],
        date=tx_date or datetime.today().date(),
        receipt=data.get("receipt", ""),
        family_number=data["family_number"]
    )
    db.session.add(transaction)
    db.session.commit()
    return jsonify({"message": "Transaction recorded", "id": transaction.id}), 201

# ✅ Delete a transaction
@tax_bp.route("/transaction/<int:id>", methods=["DELETE"])
def delete_transaction(id):
    transaction = Transaction.query.get_or_404(id)
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({"message": "Transaction deleted"}), 200

# ✅ Get all transactions for a family_number with pagination
@tax_bp.route("/family/<string:family_number>", methods=["GET"])
def get_family_transactions(family_number):
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 5, type=int)

    pagination = Transaction.query.filter_by(family_number=family_number).paginate(
        page=page, per_page=limit, error_out=False
    )

    transactions = [
        {
            "id": t.id,
            "details": t.details,
            "amount": t.amount,
            "date": t.date.isoformat() if t.date else None,
            "receipt": t.receipt,
            "family_number": t.family_number
        } for t in pagination.items
    ]

    return jsonify({
        "transactions": transactions,
        "page": pagination.page,
        "pages": pagination.pages,
        "total": pagination.total
    })

# ✅ Search transactions by family_number or details with pagination
@tax_bp.route("/search", methods=["GET"])
def search_transactions():
    query = request.args.get("q", "")
    page = request.args.get("page", 1, type=int)
    limit = request.args.get("limit", 5, type=int)

    pagination = Transaction.query.filter(
        (Transaction.family_number.ilike(f"%{query}%")) |
        (Transaction.details.ilike(f"%{query}%"))
    ).paginate(page=page, per_page=limit, error_out=False)

    results = [
        {
            "id": t.id,
            "details": t.details,
            "amount": t.amount,
            "date": t.date.isoformat() if t.date else None,
            "receipt": t.receipt,
            "family_number": t.family_number
        } for t in pagination.items
    ]

    return jsonify({
        "results": results,
        "page": pagination.page,
        "pages": pagination.pages,
        "total": pagination.total
    })

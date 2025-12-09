from .extensions import db
from datetime import date

class Transaction(db.Model):
    __tablename__ = "transactions"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    details = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    date = db.Column(db.Date, default=date.today)
    receipt = db.Column(db.String(255))

    # ✅ Use family_number instead of family_id
    family_number = db.Column(db.String(50), nullable=False, index=True)



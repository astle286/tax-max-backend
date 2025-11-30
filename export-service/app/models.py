from .extensions import db
from datetime import date

class Transaction(db.Model):
    __tablename__ = "transactions"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    details = db.Column(db.String)
    amount = db.Column(db.Float)
    date = db.Column(db.Date)
    receipt = db.Column(db.String)

    family_id = db.Column(db.String, db.ForeignKey("families.id"), nullable=False)
from .extensions import db
from datetime import date

class TaxPayment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    member_name = db.Column(db.String(100), nullable=False)
    family_number = db.Column(db.String(20), nullable=False)
    date_received = db.Column(db.Date, nullable=False)
    mode = db.Column(db.String(50), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    reason = db.Column(db.String(200), nullable=True)

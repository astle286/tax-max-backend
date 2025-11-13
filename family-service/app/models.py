from .extensions import db

class Family(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    family_number = db.Column(db.String(50), unique=True, nullable=False)
    members = db.relationship("Member", backref="family", lazy=True)

class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    gender = db.Column(db.String(10), nullable=False)
    family_id = db.Column(db.Integer, db.ForeignKey("family.id"), nullable=False)

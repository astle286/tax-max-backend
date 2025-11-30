from .extensions import db

class Family(db.Model):
    __tablename__ = "families"

    id = db.Column(db.Integer, primary_key=True)
    family_number = db.Column(db.String(50), unique=True, nullable=False)
    group = db.Column(db.String(50))

    members = db.relationship("Member", back_populates="family", lazy=True)


class Member(db.Model):
    __tablename__ = "members"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(20))
    dob = db.Column(db.String(20))
    role = db.Column(db.String(50))
    mobile = db.Column(db.String(20))
    email = db.Column(db.String(100))

    family_id = db.Column(db.Integer, db.ForeignKey("families.id"), nullable=False)

    family = db.relationship("Family", back_populates="members")

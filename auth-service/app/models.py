from . import db
from datetime import date
from flask_login import UserMixin

class Group(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    families = db.relationship('Family', backref='group', lazy=True)

class Family(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    family_number = db.Column(db.String(20), unique=True, nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'), nullable=True)
    members = db.relationship('Member', backref='family', lazy=True)

class Member(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    dob = db.Column(db.Date, nullable=False)
    sex = db.Column(db.String(10), nullable=False)
    family_id = db.Column(db.Integer, db.ForeignKey('family.id'), nullable=False)

    @property
    def age(self):
        today = date.today()
        return today.year - self.dob.year - ((today.month, today.day) < (self.dob.month, self.dob.day))

    @property
    def is_taxable(self):
        return self.sex.lower() == 'male' and self.age >= 18

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
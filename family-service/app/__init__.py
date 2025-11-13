import time
from flask import Flask
from .extensions import db
from .routes import family_bp
from sqlalchemy.exc import OperationalError
from .models import Family, Member
import os

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'supersecretkey')
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL",
        'postgresql://taxmax:secret@db:5432/family_db'
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    from .routes import family_bp
    app.register_blueprint(family_bp)
    for _ in range(10):
        try:
            with app.app_context():
                db.create_all()
            break
        except OperationalError:
            print("Database not ready, retrying...")
            time.sleep(2)

    return app

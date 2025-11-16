import time
from flask import Flask
from .extensions import db
from sqlalchemy.exc import OperationalError
from .models import Family, Member
import os
from config import Config
from .routes import family_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
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

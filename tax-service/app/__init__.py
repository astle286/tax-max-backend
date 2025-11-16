from flask import Flask
from .extensions import db
import os
from .routes import tax_bp
import time
from sqlalchemy.exc import OperationalError
from config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    from .routes import tax_bp
    app.register_blueprint(tax_bp)
    for _ in range(10):
        try:
            with app.app_context():
                db.create_all()
            break
        except OperationalError:
            print("Database not ready, retrying...")
            time.sleep(2)
    

    return app

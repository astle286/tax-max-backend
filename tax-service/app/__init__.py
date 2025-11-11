from flask import Flask
from .extensions import db
import os
from .routes import tax_bp
import time
from sqlalchemy.exc import OperationalError


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
        'DATABASE_URL',
        'postgresql://taxmax:secret@db:5432/tax_db'  # ✅ complete URI
    )
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

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

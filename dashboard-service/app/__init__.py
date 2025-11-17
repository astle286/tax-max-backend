from flask import Flask
from .routes import dashboard_bp
from .extensions import db
from config import Config
import time
from sqlalchemy.exc import OperationalError
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    db.init_app(app)
    app.register_blueprint(dashboard_bp)

    for _ in range(10):
        try:
            with app.app_context():
                db.create_all()
            break
        except OperationalError:
            print("Database not ready, retrying...")
            time.sleep(2)

    return app

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
import os
import time
from sqlalchemy.exc import OperationalError
from config import Config

# Initialize extensions
db = SQLAlchemy()
bcrypt = Bcrypt()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)

    # Core configuration
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)
    
    from .routes import auth_bp
    app.register_blueprint(auth_bp)

    # Retry loop for DB readiness
    for _ in range(10):
        try:
            with app.app_context():
                db.create_all()
            break
        except OperationalError:
            print("Database not ready, retrying...")
            time.sleep(2)

    return app

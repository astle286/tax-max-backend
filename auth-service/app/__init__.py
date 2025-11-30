from flask import Flask
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
import time
from sqlalchemy.exc import OperationalError
from config import Config
from .extensions import db
from flask_cors import CORS

bcrypt = Bcrypt()
login_manager = LoginManager()

def create_app():
    app = Flask(__name__)

    # ✅ Configure CORS once, with proper settings
    CORS(app,
         resources={r"/auth/*": {"origins": "http://localhost:5173"}},
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"])

    # Core configuration
    app.config.from_object(Config)

    # Initialize extensions
    db.init_app(app)
    bcrypt.init_app(app)
    login_manager.init_app(app)

    # Register blueprints
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

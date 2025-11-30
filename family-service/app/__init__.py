import os
import time   # ✅ added so time.sleep works
from flask import Flask, jsonify
from sqlalchemy.exc import OperationalError
from config import Config
from .extensions import db
from .routes import family_bp
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # ✅ Enable CORS for frontend
    CORS(app, resources={r"/family/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

    # Initialize extensions
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(family_bp)

    # ✅ Retry loop for DB readiness
    for attempt in range(10):
        try:
            with app.app_context():
                db.create_all()
            print("Database initialized successfully.")
            break
        except OperationalError:
            print(f"Attempt {attempt+1}: Database not ready, retrying...")
            time.sleep(2)
    else:
        print("Failed to connect to the database after multiple attempts.")

    # ✅ Global error handlers
    @app.errorhandler(400)
    def bad_request(e):
        return jsonify({"error": "Bad Request", "message": str(e)}), 400

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Not Found", "message": str(e)}), 404

    @app.errorhandler(409)
    def conflict(e):
        return jsonify({"error": "Conflict", "message": str(e)}), 409

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal Server Error", "message": "Something went wrong"}), 500

    # ✅ Catch-all for unhandled exceptions
    @app.errorhandler(Exception)
    def handle_unexpected_error(e):
        return jsonify({
            "error": "Unexpected Error",
            "message": str(e)
        }), 500

    return app

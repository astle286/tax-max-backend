from flask import Flask

def create_app():
    app = Flask(__name__)

    from .routes import export_bp
    app.register_blueprint(export_bp)

    return app

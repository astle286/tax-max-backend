import os

class Config:
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    SECRET_KEY = os.getenv("SECRET_KEY", "default-secret")

    # Auto-pick DB URI depending on context
    if os.getenv("RUNNING_IN_DOCKER"):
        SQLALCHEMY_DATABASE_URI = os.getenv("DOCKER_DATABASE_URL")
    else:
        SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")

    SQLALCHEMY_TRACK_MODIFICATIONS = False

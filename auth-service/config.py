import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default-auth-secret")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://auth_user:auth_pass@localhost/auth_db")
    JWT_SECRET = os.getenv("JWT_SECRET", "default-jwt-secret")
    FLASK_ENV = os.getenv("FLASK_ENV", "development")

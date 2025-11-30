import os
from dotenv import load_dotenv

# Load whichever .env is present
load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default-auth-secret")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    JWT_SECRET = os.getenv("JWT_SECRET", "default-jwt-secret")
    FLASK_ENV = os.getenv("FLASK_ENV", "development")

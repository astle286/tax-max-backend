import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default-family-secret")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://family_user:family_pass@localhost/family_db")
    FLASK_ENV = os.getenv("FLASK_ENV", "development")

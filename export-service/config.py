import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default-export-secret")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://export_user:export_pass@localhost/export_db")
    EXPORT_FORMATS = os.getenv("EXPORT_FORMATS", "pdf,xlsx").split(",")
    FLASK_ENV = os.getenv("FLASK_ENV", "development")

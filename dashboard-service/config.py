import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default-dashboard-secret")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "postgresql://dashboard_user:dashboard_pass@dashboard_db:5432/dashboard_db"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

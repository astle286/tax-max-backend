import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "default-tax-secret")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql://tax_user:tax_pass@localhost/tax_db")
    TAX_THRESHOLD = int(os.getenv("TAX_THRESHOLD", "18"))
    FLASK_ENV = os.getenv("FLASK_ENV", "development")

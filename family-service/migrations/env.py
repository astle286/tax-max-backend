from logging.config import fileConfig
import os
import sys

from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv

# Add project root to sys.path so we can import extensions/models
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.models import db


# Load whichever .env is present (.env.local or .env.docker)
load_dotenv()

config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# ✅ Alembic needs metadata from your models
target_metadata = db.Model.metadata

# Smart DB URL selection
if os.getenv("RUNNING_IN_DOCKER") == "true":
    # Inside Docker: connect to the family_db service on port 5432
    database_url = os.getenv(
        "DOCKER_DATABASE_URL",
        "postgresql://family_user:family_pass@family_db:5432/family_db"
    )
else:
    # On host: connect via localhost:5433
    database_url = os.getenv(
        "DATABASE_URL",
        "postgresql://family_user:family_pass@localhost:5433/family_db"
    )

if database_url:
    config.set_main_option("sqlalchemy.url", database_url)


def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

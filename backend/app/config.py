import os
from dotenv import load_dotenv

# Load environments
load_dotenv()


class Config:
    SECRET_KEY = os.getenv(
        "SECRET_KEY", "465436ce466eb4523e1a2846bf2672167e25573cbd66d826269ff337adf6cf7f"
    )
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "mysql://root:skullotaku@localhost/smartattend"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "bdad6c8805ea8e4ac2e718f8c4c699ccdd28435622aa0ecc3ad449e7678c427e",
    )
    
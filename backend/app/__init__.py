from flask import Flask
from app.config import Config
from app.extentions import db, jwt, cors, migrate
from app.models import User  # Import models
from app.routes.auth_routes import auth_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    migrate.init_app(app, db)

    # Routes
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    return app

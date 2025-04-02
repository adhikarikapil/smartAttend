from flask import Flask
from app.config import Config
from app.extentions import db, jwt, cors, migrate
from app.routes.auth_routes import auth_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Ensure these JWT settings are set
    app.config['JWT_SECRET_KEY'] = app.config.get('SECRET_KEY', 'super-secret-key')
    # Use the correct parameter names for JWT blacklist settings
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_BLOCKLIST_ENABLED'] = True
    app.config['JWT_BLOCKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

    # Setup extensions
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    migrate.init_app(app, db)

    # Routes
    app.register_blueprint(auth_bp, url_prefix='/api/auth')

    return app

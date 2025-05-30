from flask import Flask
from app.config import Config
from app.extentions import db, jwt, cors, migrate
from app.routes.auth_routes import auth_bp
from app.routes.classroom_routes import classroom_bp
from app.routes.face_routes import face_bp

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
    app.register_blueprint(classroom_bp, url_prefix='/api/classroom')
    app.register_blueprint(face_bp, url_prefix='/api/face')

    return app

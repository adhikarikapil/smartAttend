from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate

db = SQLAlchemy()
jwt = JWTManager()
cors = CORS()
migrate = Migrate()

# Setup JWT blacklist 
@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, jwt_payload):
    from app.utils.jwt_utils import check_if_token_in_blacklist
    return check_if_token_in_blacklist(jwt_header, jwt_payload)

@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return {
        'message': 'The token has been revoked. Please login again.',
        'error': 'token_revoked'
    }, 401
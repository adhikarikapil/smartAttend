from app import jwt
from datetime import datetime, timezone, timedelta
from app import app
from blacklist import blacklist


ACCESS_TOKEN_EXPIRY = 30  # In minutes
REFRESH_TOKEN_EXPIRY = 30  # In days


def generate_access_token(user_id, role):
    expiration = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRY)
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": expiration,
    }
    return jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")


def generate_refresh_token(user_id):
    expiration = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRY)
    payload = {
        "user_id": user_id,
        "exp": expiration,
    }
    return jwt.encode(payload, app.config["SECRET_KEY"], algorithm="HS256")

@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    return jwt_payload['jti'] in blacklist


def decode_token(token):
    try:
        return jwt.decode(token, app.config["SECRET_KEY"], algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

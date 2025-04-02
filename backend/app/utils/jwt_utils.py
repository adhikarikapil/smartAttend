from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    decode_token as jwt_decode,
    get_jwt_identity
)
from flask import current_app
from datetime import datetime, timezone, timedelta
from app.utils.blacklist import blacklist


ACCESS_TOKEN_EXPIRY = 30  # In minutes
REFRESH_TOKEN_EXPIRY = 30  # In days


def generate_access_token(user_id, role):
    identity = {"user_id": user_id, "role": role}
    return create_access_token(
        identity=identity,
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRY),
    )


def generate_refresh_token(user_id):
    identity = {"user_id": user_id}
    return create_refresh_token(
        identity=identity,
        expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRY),
    )


def check_if_token_in_blacklist(jwt_header, jwt_payload):
    jti = jwt_payload.get('jti')
    if not jti:
        return True  # If no JTI, consider it invalid
    return jti in blacklist


def decode_token(token):
    """Safely decode a JWT token without verification for blacklist purposes only."""
    try:
        from flask_jwt_extended.jwt_manager import decode_token
        return decode_token(token, csrf_value=None, allow_expired=True)
    except Exception as e:
        print(f"Token decode error: {e}")
        return None


def logout_user(access_token, refresh_token):
    """Add tokens to the blacklist"""
    try:
        # Get JTIs from tokens
        access_decoded = decode_token(access_token)
        refresh_decoded = decode_token(refresh_token)
        
        if access_decoded and 'jti' in access_decoded:
            blacklist.add(access_decoded['jti'])
            
        if refresh_decoded and 'jti' in refresh_decoded:
            blacklist.add(refresh_decoded['jti'])
            
        return True
    except Exception as e:
        print(f"Error during logout: {e}")
        return False


def is_token_blacklisted(token):
    """Check if a token is in the blacklist"""
    try:
        decoded = decode_token(token)
        if decoded and 'jti' in decoded:
            return decoded['jti'] in blacklist
        return True  # If can't get JTI, consider it invalid
    except Exception as e:
        print(f"Error checking blacklist: {e}")
        return True  # If error decoding, consider it invalid

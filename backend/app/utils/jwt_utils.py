from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    decode_token,
)
from flask import current_app
from datetime import datetime, timezone, timedelta
from app.utils.blacklist import blacklist
import json

ACCESS_TOKEN_EXPIRY = 120  # In minutes
REFRESH_TOKEN_EXPIRY = 90  # In days


def generate_access_token(user_id, role, first_name, second_name, email):
    identity = {
        "userId": user_id,
        "role": role,
        "firstName": first_name,
        "secondName": second_name,
        "email": email,
    }

    identity_str = json.dumps(identity)

    return create_access_token(
        identity=identity_str,
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRY),
    )


def generate_refresh_token(user_id):
    identity = {"userId": user_id}
    identity_str = json.dumps(identity)
    return create_refresh_token(
        identity=identity_str,
        expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRY),
    )


def logout_user(access_token, refresh_token):
    try:
        # Get JTIs from tokens
        access_decoded = decode_token(access_token)
        refresh_decoded = decode_token(refresh_token)

        if access_decoded and "jti" in access_decoded:
            blacklist.add(access_decoded["jti"])

        if refresh_decoded and "jti" in refresh_decoded:
            blacklist.add(refresh_decoded["jti"])

        return True
    except Exception as e:
        print(f"Error during logout: {e}")
        return False


def is_token_blacklisted(token):
    try:
        decoded = decode_token(token)
        if decoded and "jti" in decoded:
            return decoded["jti"] in blacklist
        return True  # If can't get JTI, consider it invalid
    except Exception as e:
        print(f"Error checking blacklist: {e}")
        return True  # If error decoding, consider it invalid

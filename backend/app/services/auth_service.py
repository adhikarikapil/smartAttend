from app.extentions import db
from app.models.user import User
from app.models.refresh_token import Refresh_token
from app.utils import (
    generate_access_token,
    generate_refresh_token,
    is_token_blacklisted,
)
import json


def authenticate_user(email, password):
    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        access_token = generate_access_token(
            user.id, user.role, user.first_name, user.second_name, user.email
        )
        refresh_token = generate_refresh_token(user.id)

        try:
            new_refresh_token = Refresh_token(token=refresh_token, user_id=user.id)
            db.session.add(new_refresh_token)
            db.session.commit()
        except Exception as e:
            print(f"Error storing refresh token: {e}")
            db.session.rollback()
            return None, None

        return access_token, refresh_token
    return None, None


def refresh_access_token(refresh_token):
    from flask_jwt_extended import decode_token

    if is_token_blacklisted(refresh_token):
        print("Attempted to use blacklisted refresh token")
        return None

    decoded_data = decode_token(refresh_token)
    if not decoded_data or "sub" not in decoded_data:
        print("Invalid refresh token format")
        return None

    try:
        identity = decoded_data.get("sub")

        if isinstance(identity, str):
            identity = json.loads(identity)

        if isinstance(identity, dict) and "userId" in identity:
            user_id = identity["userId"]

        else:
            print("Invalid identity format in token")
            return None

        token_record = Refresh_token.query.filter_by(token=refresh_token).first()
        if not token_record or token_record.user_id != user_id:
            print("Token not found in database or user_id mismatch")
            return None

        user = User.query.get(user_id)
        if user:
            return generate_access_token(
                user.id, user.role, user.first_name, user.second_name, user.email
            )

        print("User not found")
        return None
    except Exception as e:
        print(f"Error in refresh_access_token: {e}")
        return None


def logout(access_token, refresh_token):
    from app.utils import logout_user

    success = False
    try:
        token_record = Refresh_token.query.filter_by(token=refresh_token).first()
        if token_record:
            db.session.delete(token_record)
            db.session.commit()
            success = True
    except Exception as e:
        print(f"Error removing refresh token from DB: {e}")
        db.session.rollback()

    blacklist_success = logout_user(access_token, refresh_token)

    return success or blacklist_success

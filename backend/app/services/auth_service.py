from app.extentions import db
from app.models.user import User
from app.models.refresh_token import Refresh_token
from app.utils import (
    generate_access_token,
    generate_refresh_token,
    decode_token,
    check_if_token_in_blacklist,
    is_token_blacklisted,
)


def authenticate_user(email, password):
    """Authenticate a user by email and password, returning tokens if successful"""
    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        access_token = generate_access_token(
            user.id, user.role, user.first_name, user.second_name, user.email
        )
        refresh_token = generate_refresh_token(user.id)

        # Store the refresh token in the database
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
    """Generate a new access token using a refresh token"""
    # First check if the token is blacklisted
    if is_token_blacklisted(refresh_token):
        print("Attempted to use blacklisted refresh token")
        return None

    # Decode the token to get user_id
    decoded_data = decode_token(refresh_token)
    if not decoded_data or "sub" not in decoded_data:
        print("Invalid refresh token format")
        return None

    # Extract user_id from the token identity (sub claim)
    try:
        identity = decoded_data.get("sub")
        if isinstance(identity, dict) and "user_id" in identity:
            user_id = identity["user_id"]
        else:
            print("Invalid identity format in token")
            return None

        # Verify the token exists in our database
        token_record = Refresh_token.query.filter_by(token=refresh_token).first()
        if not token_record or token_record.user_id != user_id:
            print("Token not found in database or user_id mismatch")
            return None

        # Get the user and generate new access token
        user = User.query.get(user_id)
        if user:
            return generate_access_token(user.id, user.role)

        print("User not found")
        return None
    except Exception as e:
        print(f"Error in refresh_access_token: {e}")
        return None


def logout(access_token, refresh_token):
    """Logout a user by blacklisting their tokens and removing the refresh token from DB"""
    from app.utils import logout_user

    # Find and remove the refresh token from the database
    success = False
    try:
        # Try to find the token in the database
        token_record = Refresh_token.query.filter_by(token=refresh_token).first()
        if token_record:
            db.session.delete(token_record)
            db.session.commit()
            success = True
    except Exception as e:
        print(f"Error removing refresh token from DB: {e}")
        db.session.rollback()

    # Add tokens to blacklist
    blacklist_success = logout_user(access_token, refresh_token)

    # Return true if either operation succeeded
    return success or blacklist_success

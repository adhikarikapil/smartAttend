from app import db
from app.models.user import User
from app.models.refresh_token import Refresh_token
from app.utils import generate_access_token, generate_refresh_token, decode_token, check_if_token_in_blacklist


def authenticate_user(email, password):
    user = User.query.filter_by(email=email).first()

    if user and User.check_password(password):
        access_token = generate_access_token(user.id, user.role)
        refresh_token = generate_refresh_token(user.id)

        new_refresh_token = Refresh_token(refresh_token)

        db.session.add(new_refresh_token)
        db.session.commit

        return access_token, refresh_token


def refresh_access_token(refresh_token):
    decoded_data = decode_token(refresh_token)

    if not decoded_data:
        return None
    
    user_id = decoded_data.get('user_id')

    if Refresh_token.get('user_id') != user_id:
        return None

    user = User.query.get('user_id')

    if user:
        return generate_access_token(user.id, user.role)
    return None
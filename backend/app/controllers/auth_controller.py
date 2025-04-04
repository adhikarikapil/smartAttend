from flask import request, jsonify
from app.extentions import db
from app.models import User
from app.services.auth_service import authenticate_user, refresh_access_token, logout
from app.utils import is_token_blacklisted
from flask_jwt_extended import get_jwt_identity, decode_token


# Handle http request and response
def register_user():
    try:
        data = request.get_json()

        # Extract User data
        first_name = data.get("firstName")
        second_name = data.get("secondName")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role")

        # Make sure user gives all field
        if not first_name or not second_name or not email or not password or not role:
            return jsonify({"error": "Missing required fields"}), 400

        # Check if user already exists or not
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "User already exists"}), 400

        # Create a new user
        new_user = User(
            first_name=first_name,
            second_name=second_name,
            email=email,
            password=password,
            role=role,
        )

        # Add new_user to database
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully!!!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)})


def login_user():
    try:
        data = request.get_json()

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required!!!"}), 400

        access_token, refresh_token = authenticate_user(email, password)

        if access_token:
            return (
                jsonify(
                    {
                        "message": "Login Sucessful!!!",
                        "accessToken": access_token,
                        "refreshToken": refresh_token,
                    }
                ),
                200,
            )
        else:
            return jsonify({"error": "Invalid Email or Password!!!"}), 401

    except Exception as e:
        return jsonify({"error": str(e)})


def refresh_token():
    try:
        data = request.get_json()
        refresh_token = data.get("refreshToken")

        if not refresh_token:
            return jsonify({"error": "Refresh Token is Required!!!"}), 400

        # Check if token is blacklisted
        if is_token_blacklisted(refresh_token):
            return (
                jsonify({"error": "Token has been revoked. Please login again."}),
                401,
            )

        new_access_token = refresh_access_token(refresh_token)

        if new_access_token:
            return jsonify({"accessToken": new_access_token}), 200
        else:
            return jsonify({"error": "Invalid or expired refresh token!!!"}), 401

    except Exception as e:
        return jsonify({"error": str(e)}), 400


def logout_user():
    try:
        data = request.get_json()
        access_token = data.get("accessToken")
        refresh_token = data.get("refreshToken")

        if not access_token or not refresh_token:
            return (
                jsonify({"error": "Access token and refresh token are required!!!"}),
                400,
            )

        # Blacklist the tokens
        success = logout(access_token, refresh_token)

        if success:
            return jsonify({"message": "Logout successful"}), 200
        else:
            return jsonify({"error": "Error processing logout"}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500


def test_blacklist():
    """Test endpoint to check if blacklist functionality is working"""
    try:
        from app.utils.blacklist import blacklist

        return (
            jsonify(
                {
                    "message": "Blacklist status",
                    "total_blacklisted_tokens": len(blacklist),
                    "blacklist": list(blacklist),
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500


def token_checking():
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Authorization header missing or Invalid format"})

    token = auth_header[7:]

    try:
        # decoded_token = check_token(token)
        decoded_token = decode_token(token)

        print("DECODED: ", decoded_token)

        user_info = decoded_token.get("sub")

        print("UserInfo: ",user_info)

        if user_info:
            return jsonify({"message": "Token is valid", "user": user_info}), 200
        else:
            return jsonify({"error": "No information in token"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 400

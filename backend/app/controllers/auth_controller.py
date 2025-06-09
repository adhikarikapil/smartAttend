from flask import request, jsonify
from app.extentions import db
from app.models import User
from app.services.auth_service import authenticate_user, refresh_access_token, logout
from app.utils import is_token_blacklisted


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

        return (
            jsonify({"message": "User created successfully!!!"}),
            201,
        )

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

        user = User.query.filter_by(email=email).first()

        if access_token:
            if user.first_login:
                user.first_login = False
                db.session.commit()
                return (
                    jsonify(
                        {
                            "message": "Login Sucessful!!!",
                            "accessToken": access_token,
                            "refreshToken": refresh_token,
                            "isFirstLogin": "It is his first login",
                            "user": {
                                "userId": user.id,
                                "firstName": user.first_name,
                                "secondName": user.second_name,
                                "email": user.email,
                                "role": user.role,
                            },
                        }
                    ),
                    200,
                )
            else:
                return (
                    jsonify(
                        {
                            "message": "Login Sucessful!!!",
                            "accessToken": access_token,
                            "refreshToken": refresh_token,
                            "user": {
                                "userId": user.id,
                                "firstName": user.first_name,
                                "secondName": user.second_name,
                                "email": user.email,
                                "role": user.role,
                            },
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

from flask import request, jsonify
from app import db
from app.models import User
from datetime import datetime, timezone


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

        print(
            f"firstName: {first_name}, secondName: {second_name}, email: {email}, password: {password}, role: {role}"
        )

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
            role=role
        )

        # Add new_user to database
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User created successfully!!!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)})

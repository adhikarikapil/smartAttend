from flask import request, jsonify
from app.extentions import db
from app.models.classroom import Classroom, ClassroomUser
from app.models.user import User
from app.utils.jwt_utils import decode_token
import json


# handle http request for creating classroom
def create_classroom():
    try:
        data = request.get_json()

        # Extract access token for userData
        header = request.headers.get("authorization")
        token = header.split()[1]

        decoded_token = decode_token(token)

        if decoded_token["sub"]:
            identity = decoded_token["sub"]

        identity = json.loads(identity)

        if isinstance(identity, dict):
            user_id = identity["userId"]
        else:
            return jsonify({"error": "Invalid identity format"})

        if not user_id:
            return jsonify({"error": "No user data or missing user data in Token"}), 404

        name = data.get("className")
        code = data.get("code")
        description = data.get("description")
        if not name or not code:
            return jsonify({"error": "Missing required Field"}), 400

        db_code = Classroom.query.filter_by(code=code).first()
        if db_code:
            return jsonify({"error": "Code already used!!"}), 400

        existing_classroom = Classroom.query.filter_by(name=name).first()
        if existing_classroom:
            return jsonify({"error": "Classroom already exists"}), 400

        new_classroom = Classroom(
            name=name, code=code, description=description, creator_id=user_id
        )

        db.session.add(new_classroom)
        db.session.commit()

        return jsonify({"message": "Classroom Created Successfully!!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 400


def join_classroom():
    try:
        data = request.get_json()

        header = request.headers.get("Authorization")
        token = header.split()[1]

        decoded_token = decode_token(token)

        if decoded_token["sub"]:
            identity = decoded_token["sub"]
        else:
            return jsonify({"error": "No data found in token!!!"}), 404

        identity = json.loads(identity)

        if isinstance(identity, dict):
            user_id = identity["userId"]
            user_email = identity["email"]
        else:
            return jsonify({"error": "Invalid identity format in token"}), 400

        # Extract Post data
        code = data.get("code")

        classroom_to_join = Classroom.query.filter_by(code=code).first()

        if not classroom_to_join:
            return jsonify({'error': 'Invalid Code!!'}), 400

        classroom_id = classroom_to_join.id

        already_join = ClassroomUser.query.filter_by(classroom_id=classroom_id).first()
        if already_join:
            return jsonify({'error': 'Classroom Already Joined'}), 400

        new_join = ClassroomUser(
            classroom_id=classroom_id, user_id=user_id, user_email=user_email
        )
        try:
            db.session.add(new_join)
            db.session.commit()
        except:
            return jsonify({"error": "Cannot join!!!"}), 400

        return jsonify({"message": "User joined successfully!!"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


def list_classroom():
    # get token from header
    try:
        header = request.headers.get("Authorization")
        token = header.split()[1]

        if not token:
            return jsonify({"error": "No token in authorization header!"}), 400

        decoded_token = decode_token(token)

        if decoded_token["sub"]:
            identity = decoded_token["sub"]
        else:
            return (
                jsonify({"error": "No identity or identity not found in token."}),
                404,
            )

        identity = json.loads(identity)

        if isinstance(identity, dict):
            user_id = identity["userId"]
            role = identity["role"]

        if role == "teacher":
            try:
                classroom = Classroom.query.filter_by(creator_id=user_id).all()
                user = User.query.filter_by(id=user_id).first()

                serialized_classroom = [
                    {
                        "classroomId": c.id,
                        "name": c.name,
                        "code": c.code,
                        "description": c.description,
                        "firstName": user.second_name,
                        "secondName": user.second_name,
                        "email": user.email,
                    }
                    for c in classroom
                ]
                return jsonify(
                    {"message": "Classrooms found", "classroom": serialized_classroom},
                    200,
                )
            except:
                return jsonify({"error": "Cannot show classroom you created!!"}), 400
        elif role == "student":
            try:
                user = User.query.filter_by(id=user_id).first()
                classroom = ClassroomUser.query.filter_by(user_id=user_id).all()

                serialized_classroom = [
                    {
                        "classroomId": c.id,
                        "name": c.id,
                        "description": c.id,
                        "firstName": user.first_name,
                        "secondName": user.second_name,
                        "email": user.email,
                    }
                    for c in classroom
                ]
                return jsonify(
                    {
                        "message": "Found classroom you joined!!",
                        "classroom": serialized_classroom,
                    }
                )

            except:
                return jsonify({"error": "Cannot show classroom you joined"}), 400
        else:
            return jsonify({"error": "wait for admin"})

    except Exception as e:
        return jsonify({"error": str(e)})

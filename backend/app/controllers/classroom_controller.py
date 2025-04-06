from flask import request, jsonify
from app.extentions import db
from app.models.classroom import Classroom, ClassroomUser
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
            return jsonify({'error': 'Invalid identity format'})

        if not user_id:
            return jsonify({"error": "No user data or missing user data in Token"}), 404

        name = data.get("className")
        code = data.get("code")
        description = data.get("description")

        if not name or not code:
            return jsonify({"error": "Missing required Field"}), 400

        existing_classroom = Classroom.query.filter_by(name=name).first()

        if existing_classroom:
            return jsonify({"error": "Classroom already exists"}), 400

        new_classroom = Classroom(
            name=name, code=code, description=description, creator_id=user_id
        )

        try:
            db.session.add(new_classroom)
            db.session.commit()
        except:
            return jsonify({"error": "Cannot create classroom!!"}), 400

        return jsonify({"message": "Classroom Created Successfully!!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)})



def join_classroom():
    try: 
        data = request.get_json()

        header = request.headers.get('Authorization')
        token = header.split()[1]

        decoded_token = decode_token(token)

        if decoded_token['sub']:
            identity = decoded_token['sub']
        else:
            return jsonify({'error': 'No data found in token!!!'}), 404

        identity = json.loads(identity)

        if isinstance(identity, dict):
            user_id = identity['userId']
            user_email = identity['email']
        else:
            return jsonify({'error': 'Invalid identity format in token'}), 400
        
        #Extract Post data
        code = data.get('code')

        classroom_to_join = Classroom.query.filter_by(code=code).first()

        classroom_id = classroom_to_join.id

        new_join = ClassroomUser(
            classroom_id = classroom_id,
            user_id = user_id,
            user_email = user_email
        )
        try:
            db.session.add(new_join)
            db.session.commit()
        except:
            return jsonify({'error': 'Cannot join!!!'}), 400

        return jsonify({'message': 'User joined successfully!!'}), 200

    except Exception as e:
        return jsonify({'error': str(e)})
from flask import request, jsonify
from app.extentions import db
from app.models import Notice
from app.utils.jwt_utils import decode_token
import json


def add_notice():
    header = request.headers.get("Authorization")
    if not header:
        return jsonify({"error": "No header Authorization"}), 400

    token = header.split(" ")[1]
    decoded_token = decode_token(token)

    identity = json.loads(decoded_token["sub"])
    if isinstance(identity, dict):
        teacher_id = identity["userId"]
        role = identity["role"]
    else:
        return jsonify({"error": "Invalid identity format."}), 400

    if not teacher_id:
        return (
            jsonify({"error": "No teacher data or missing teacher data in token"}),
            400,
        )

    classroom_id = request.args.get("classroomId")

    data = request.get_json()
    title = data.get("title")
    message = data.get("message")

    try:
        if role == "teacher":
            notice = Notice(
                classroom_id=classroom_id,
                teacher_id=teacher_id,
                title=title,
                message=message,
            )
            db.session.add(notice)
            db.session.commit()
            return jsonify({"message": "Notice added successfully."}), 200
        else:
            return jsonify({"error": "Invalid role"}), 400
    except Exception as err:
        return jsonify({"error": f"Error adding notice: {str(err)}"}), 400


def list_notice():
    classroom_id = request.args.get("classroomId")
    if not classroom_id:
        return jsonify({"error": "Missing classroomId."}), 400

    try:
        notice = Notice.query.filter_by(classroom_id=classroom_id).all()
        notice_list = [
            {
                'id': n.id,
                "teacherId": n.teacher_id,
                "classroomId": n.classroom_id,
                "title": n.title,
                "message": n.message,
                'createdAt': n.created_at,
            }
            for n in notice
        ]

        return (
            jsonify({"message": "Notice fetched successfully.", "notice": notice_list}),
            200,
        )
    except Exception as err:
        return jsonify({"error": f"Error fetching notice: {str(err)}"})

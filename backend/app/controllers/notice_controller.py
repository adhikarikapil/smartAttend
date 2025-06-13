from flask import request, jsonify
from app.extentions import db
from app.models import Notice, NoticeSeen , ClassroomUser 
from app.utils.jwt_utils import decode_token
import json

def delete_notice():
    data = request.get_json()
    notice_id = data.get('noticeId')

    if not notice_id:
        return jsonify({'error': 'Notice id is required'}), 400

    try:
        notice_to_delete = Notice.query.filter_by(id = notice_id).first()
        notice_seen = NoticeSeen.query.filter_by(notice_id = notice_id).all()
        if notice_seen:
            for notice in notice_seen:
                db.session.delete(notice)
            db.session.commit()
            
        db.session.delete(notice_to_delete)
        db.session.commit()

        return jsonify({'message': 'Notice removed successfully'}), 200
    except Exception as err:
        return jsonify({'error': f'Error in backend: {str(err)}'})



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
                "id": n.id,
                "teacherId": n.teacher_id,
                "classroomId": n.classroom_id,
                "title": n.title,
                "message": n.message,
                "createdAt": n.created_at,
            }
            for n in notice
        ]

        return (
            jsonify({"message": "Notice fetched successfully.", "notice": notice_list}),
            200,
        )
    except Exception as err:
        return jsonify({"error": f"Error fetching notice: {str(err)}"})


def unseen_notice_count():
    header = request.headers.get("Authorization")
    if not header:
        return jsonify({"error": "No header Authorization"}), 400

    token = header.split(" ")[1]
    decoded_token = decode_token(token)

    identity = json.loads(decoded_token["sub"])
    if isinstance(identity, dict):
        student_id = identity["userId"]
        role = identity["role"]
    else:
        return jsonify({"error": "Invalid identity format."}), 400

    if not student_id:
        return (
            jsonify({"error": "No student data or missing student data in token"}),
            400,
        )

    try:
        if role == "student":
            classroom_ids = (
                db.session.query(ClassroomUser.classroom_id)
                .filter_by(user_id = student_id)
                .all()
            )
            classroom_ids = [cid[0] for cid in classroom_ids]

            result = []
            for classroom_id in classroom_ids:
                all_notice_ids = (
                    db.session.query(Notice.id)
                    .filter_by(classroom_id=classroom_id)
                    .all()
                )
                all_notice_ids = set(nid[0] for nid in all_notice_ids)

                seen_notice_ids = (
                    db.session.query(NoticeSeen.notice_id)
                    .filter_by(student_id=student_id)
                    .all()
                )
                seen_notice_ids = set(nid[0] for nid in seen_notice_ids)

                unseen_ids = all_notice_ids - seen_notice_ids
                result.append({
                    'classroomId': classroom_id,
                    'unseenCount': len(unseen_ids)
                })
            return jsonify(result)
    except Exception as err:
        return jsonify({'error': f'Error counting unseen notice: {str(err)}'})
    

def mark_notices_seen():
    header = request.headers.get("Authorization")
    if not header:
        return jsonify({"error": "No header Authorization"}), 400

    token = header.split(" ")[1]
    decoded_token = decode_token(token)

    identity = json.loads(decoded_token["sub"])
    if isinstance(identity, dict):
        student_id = identity["userId"]
        role = identity["role"]
    else:
        return jsonify({"error": "Invalid identity format."}), 400

    if not student_id:
        return (
            jsonify({"error": "No student data or missing student data in token"}),
            400,
        )
    
    data = request.get_json()
    classroom_id = data.get('classroomId')

    if not classroom_id:
        return jsonify({'error': 'ClassroomId is required'}), 400

    try:
        notices_ids = (
            db.session.query(Notice.id)
            .filter_by(classroom_id=classroom_id)
            .all()
        )
        notices_ids = set(nid[0] for nid in notices_ids)

        seen_notice_ids = (
            db.session.query(NoticeSeen.notice_id)
            .filter_by(student_id = student_id)
            .all()
        )
        seen_notice_ids = set(nid[0] for nid in seen_notice_ids)

        unseen_notice_ids = notices_ids - seen_notice_ids

        new_seen_records = [
            NoticeSeen(student_id=student_id, notice_id=notice_id)
            for notice_id in unseen_notice_ids
        ]

        if new_seen_records:
            db.session.add_all(new_seen_records)
            db.session.commit()
            
        return jsonify({'message': 'Notices marked as seen'}), 200
    except Exception as err:
        db.session.rollback()
        return jsonify({f'error: {str(err)}'}), 400

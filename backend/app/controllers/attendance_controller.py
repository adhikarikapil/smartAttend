from flask import request, jsonify
from flask_socketio import SocketIO, emit
from app.extentions import db, socketio
from app.models import Attendance, Face_data, ClassroomUser
from app.utils.jwt_utils import decode_token
from datetime import datetime, timezone, timedelta
import os, cv2, face_recognition, json, base64
import numpy as np
import logging

logger = logging.getLogger(__name__)


def load_all_encodings():
    encodings = []
    metadata = []
    face_data_entries = Face_data.query.all()

    for entry in face_data_entries:
        if os.path.exists(entry.encoding_path):
            encoding = np.load(entry.encoding_path)
            encodings.append(encoding)
            metadata.append(
                {
                    "user_id": entry.user_id,
                    "roll_no": entry.roll_no,
                    "name": entry.user.first_name + " " + entry.user.second_name,
                }
            )

    return encodings, metadata


@socketio.on("connect")
def handle_connect():
    logger.info("Client Connected", extra={
        "sid": request.sid,
        "transport": request.environ.get('socketio').transport.name if hasattr(request.environ, 'socketio') else 'unknown',
        "headers": dict(request.headers),
        "remote_addr": request.remote_addr
    })
    print(f"Client Connected - SID: {request.sid}")


@socketio.on("connect_error")
def handle_connect_error(error):
    logger.error("Connection error", extra={
        "error": str(error),
        "sid": request.sid if hasattr(request, 'sid') else 'unknown',
        "headers": dict(request.headers) if hasattr(request, 'headers') else {},
        "remote_addr": request.remote_addr if hasattr(request, 'remote_addr') else 'unknown'
    })
    print(f"Connection error: {str(error)}")


@socketio.on("disconnect")
def handle_disconnect():
    logger.info("Client Disconnected", extra={
        "sid": request.sid,
        "reason": request.environ.get('socketio').transport.name if hasattr(request.environ, 'socketio') else 'unknown'
    })
    print(f"Client Disconnected - SID: {request.sid}")


@socketio.on("mark_attendance")
def mark_attendance(data):
    logger.info("Received attendance request", extra={
        "sid": request.sid,
        "classroom_id": data.get("classroomId"),
        "has_image": bool(data.get("image")),
        "has_token": bool(data.get("token"))
    })
    
    token = data.get("token")
    classroom_id = data.get("classroomId")
    image_data = data.get("image")

    if not image_data or not classroom_id or not token:
        logger.error("Missing required data", extra={
            "has_image": bool(image_data),
            "has_classroom_id": bool(classroom_id),
            "has_token": bool(token)
        })
        emit(
            "attendance_response",
            {"error": "Missing image or classroom Id or token"},
        )
        return

    try:
        identity = json.loads(decode_token(token)["sub"])
        teacher_id = identity["userId"]
        logger.info("Token decoded successfully", extra={"teacher_id": teacher_id})
    except Exception as err:
        logger.error("Token decode error", extra={"error": str(err)})
        emit("attendance_response", {"error": f"Invalid token: {str(err)}"})
        return

    try:
        image_bytes = base64.b64decode(image_data.split(",")[1])
        np_img = np.frombuffer(image_bytes, np.uint8)
        frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    except Exception as err:
        emit("attendance_response", {"error": f"Error decoding imgae: {str(err)}"})
        return

    unknown_encodings = face_recognition.face_encodings(rgb_frame)
    if not unknown_encodings:
        emit("attendance_response", {"error": "No face detected."})
        return

    known_encodings, known_metadata = load_all_encodings()

    for unknown_encoding in unknown_encodings:
        matches = face_recognition.compare_faces(
            known_encodings, unknown_encoding, tolerance=0.5
        )
        face_distances = face_recognition.face_distance(
            known_encodings, unknown_encoding
        )

        if True in matches:
            best_match_index = np.argmin(face_distances)
            matched_student = known_metadata[best_match_index]
            student_id = matched_student["user_id"]

            two_hrs_ago = datetime.now(timezone.utc) - timedelta(hours=2)
            recent_attendance = (
                Attendance.query.filter_by(
                    student_id=student_id, classroom_id=classroom_id
                )
                .filter(Attendance.marked_at >= two_hrs_ago)
                .first()
            )

            if recent_attendance:
                emit("attendance_response", {"error": "Attendance Already Marked"})
                return

            if not recent_attendance:
                try:
                    attendance = Attendance(
                        student_id=student_id,
                        roll_no=matched_student["roll_no"],
                        classroom_id=classroom_id,
                        taken_by=teacher_id,
                        status="Present",
                    )
                    db.session.add(attendance)
                    db.session.commit()

                    emit(
                        "attendance_response",
                        {
                            "message": "Attendance Marked",
                            "name": matched_student["name"],
                            "rollNo": matched_student["roll_no"],
                        },
                    )
                    return
                except Exception as err:
                    logger.error("Error saving attendance", extra={"error": str(err)})
                    emit(
                        "attendance_response",
                        {"error": f"Error saving Attendance: {str(err)}"},
                    )
                    return


def mark_absent_students():
    data = request.get_json()
    classroom_id = data.get("classroomId")

    if not classroom_id:
        return jsonify({"error": "Missing Classroom ID."}), 404

    header = request.headers.get("Authorization")
    if not header:
        return jsonify({"error": "Missing Header Authorization."}), 400

    token = header.split(" ")[1]
    decoded_token = decode_token(token)

    if decoded_token["sub"]:
        identity = decoded_token["sub"]

    identity = json.loads(identity)

    if isinstance(identity, dict):
        teacher_id = identity["userId"]
    else:
        return jsonify({"error": "Invalid identity format."}), 400

    if not teacher_id:
        return (
            jsonify({"error": "No teacher data or missing teacher data in Token"}),
            400,
        )

    current_date = datetime.now(timezone.utc).date()

    enrolled_students = ClassroomUser.query.filter_by(classroom_id=classroom_id).all()
    enrolled_student_ids = {e.student_id for e in enrolled_students}

    present_attendance = Attendance.query.filter_by(
        classroom_id=classroom_id, date=current_date, status="Present"
    ).all()
    present_student_ids = {s.student_id for s in present_attendance}

    absent_student_ids = enrolled_student_ids - present_student_ids

    try:
        for student_id in absent_student_ids:
            face_data = Face_data.query.filter_by(user_id=student_id).first()
            roll_no = Face_data.roll_no if face_data else "Unknown"

            attendance = Attendance(
                student_id=student_id,
                roll_no=roll_no,
                classroom_id=classroom_id,
                taken_by=teacher_id,
                status="Absent",
            )
            db.session.add(attendance)
        db.session.commit()
    except Exception as err:
        return jsonify({"error": f"Error adding absent student: {str(err)}"}), 400
    return (
        jsonify({"message": f"{len(absent_student_ids)} students are marked absent"}),
        200,
    )

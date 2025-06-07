from flask import jsonify, request
from app.extentions import db
from app.models import Attendance, Face_data, ClassroomUser
from app.utils.jwt_utils import decode_token
from datetime import datetime, timezone, timedelta
import os, cv2, face_recognition, json
import numpy as np


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


def mark_attendance():
    if "image" not in request.files:
        return jsonify({"error": "No images provided!!!"}), 400

    classroom_id = request.form.get("classroomId")
    if not classroom_id:
        return jsonify({"error": "Missing Classroom Id"}), 404

    header = request.headers.get("Authorization")
    token = header.split()[1]

    if not token:
        return jsonify({"error": "No token in authorization header"}), 400

    decoded_token = decode_token(token)

    if decoded_token["sub"]:
        identity = decoded_token["sub"]

    identity = json.loads(identity)

    if isinstance(identity, dict):
        teacher_id = identity["userId"]
    else:
        return jsonify({"error": "Invalid identity format in token"}), 400

    image_file = request.files["image"]
    np_img = np.frombuffer(image_file.read(), np.uint8)
    frame = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    unknown_encodings = face_recognition.face_encodings(rgb_frame)
    if not unknown_encodings:
        return jsonify({"error": "No face detected"}), 400

    known_encodings, known_metadata = load_all_encodings()

    for unknown_encoding in unknown_encodings:
        matches = face_recognition.compare_faces(
            known_encodings, unknown_encodings, tolerance=0.5
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
                    user_id=student_id, classroom_id=classroom_id
                )
                .filter(Attendance.marked_at >= two_hrs_ago)
                .first()
            )

            if recent_attendance:
                return (
                    jsonify(
                        {
                            "message": "Attendance Already Marked",
                            "name": matched_student["name"],
                        }
                    ),
                    200,
                )
            try:
                attendance = Attendance(
                    student_id=student_id,
                    classroom_id=classroom_id,
                    roll_no=matched_student["roll_no"],
                    taken_by=teacher_id,
                    status="Present",
                )
                db.session.add(attendance)
                db.session.commit()

                return (
                    jsonify(
                        {"message": "Attendance Marked", "metadata": matched_student}
                    ),
                    200,
                )
            except Exception as err:
                return (
                    jsonify({"error": f"Error marking attendance:  ${str(err)}"}),
                    400,
                )

        else:
            current_date = datetime.now(timezone.utc).date()
            enrolled_student = ClassroomUser.query.filter_by(
                classroom_id=classroom_id
            ).all()
            present_student = Attendance.query.filter_by(
                student_id=student_id, classroom_id=classroom_id, date=current_date
            ).all()

            enrolled_student_ids = {student.user_id for student in enrolled_student}
            present_student_ids = {
                attendance.student_id for attendance in present_student
            }

            absent_student_ids = enrolled_student_ids - present_student_ids

            if student_id in absent_student_ids:
                matched_students = next(
                    (s for s in enrolled_student if s.student_id == student_id), None
                )
                try:
                    if matched_students:
                        attendance = Attendance(
                            student_id=student_id,
                            classroom_id=classroom_id,
                            roll_no=matched_students.face.roll_no,
                            taken_by=teacher_id,
                            status="Absent",
                        )
                        db.session.add(attendance)
                        db.session.commit()

                except Exception as err:
                    return (
                        jsonify(
                            {
                                "error": f"Error marking Attendance for absentees: ${str(err)}"
                            }
                        ),
                        400,
                    )

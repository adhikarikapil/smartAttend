from flask import request, jsonify
from app.extentions import db
from app.models import User, Classroom, ClassroomUser, Face_data, Attendance
from app.utils.jwt_utils import decode_token
import json


def get_identity_from_header(header):
    if not header:
        print("No header authorization in request")
        return None
    token = header.split(" ")[1]
    if not token:
        print("No token in authorization header")
        return
    decoded_token = decode_token(token)
    identity = decoded_token["sub"]

    if isinstance(identity, str):
        try:
            identity = json.loads(identity)
            return identity
        except json.JSONDecodeError:
            print("Token 'sub' is not JSON")
            return None

    if isinstance(identity, dict):
        return identity

    print("Unknown Identity Format")
    return None


# Fetching
def fetch_user():
    header = request.headers.get("Authorization")
    identity = get_identity_from_header(header)
    if identity:
        role = identity["role"]
    else:
        print("Invalid Identity Format")
        return jsonify({"error": "Invalid Identity Format"}), 400
    try:
        if role == "admin":
            teacher_user = User.query.filter_by(role="teacher").all()
            teacher_users = [
                {
                    "teacherId": t.id,
                    "teacherName": t.first_name + t.second_name,
                    "teacherEmail": t.email,
                    "teacherRole": t.role,
                    'teacherCreatedAt': t.created_at
                }
                for t in teacher_user
            ]

            student_user = User.query.filter_by(role="student").all()
            student_users = [
                {
                    "studentId": s.id,
                    "studentName": s.first_name + s.second_name,
                    "studentEmail": s.email,
                    "studentRole": s.role,
                    'studentCreatedAt': s.created_at
                }
                for s in student_user
            ]
            print(f"Teacher: {teacher_users}")
            print(f"Student: {student_users}")
            return (
                jsonify({"teacherInfo": teacher_users, "studentInfo": student_users}),
                200,
            )
        else:
            print("Invalid Role for fetching user")
            return jsonify({"error": "Invalid Role for fetching user"}), 400
    except Exception as err:
        print("Error fetching user: ", str(err))
        return jsonify({"error": f"Error fetching user: {str(err)}"}), 400


def fetch_classrooms():
    header = request.headers.get("Authorization")
    identity = get_identity_from_header(header)
    if identity:
        role = identity["role"]
    else:
        print("Invalid Identity format")
        return jsonify({"error": "Invalid Identity format"}), 400

    try:
        if role == "admin":
            classrooms = Classroom.query.all()
            classroom = [
                {
                    "classroomId": c.id,
                    "classroomName": c.name,
                    "classroomCode": c.code,
                    "classroomDescription": c.description,
                    "classroomTeacherId": c.creator_id,
                    'classroomCreatedAt': c.created_at
                }
                for c in classrooms
            ]
            return jsonify({"classrooms": classroom}), 200
        else:
            print("Invalid Role for fetching classrooms")
            return jsonify({"error": "Invalid Role for fetching classroom"}), 400

    except Exception as err:
        print(f"Error fetching classrooms: {str(err)}")
        return jsonify({"error": f"Error fetching classrooms: {str(err)}"}), 400


def fetch_classroomUser():
    header = request.headers.get("Authorization")
    identity = get_identity_from_header(header)
    if identity:
        role = identity["role"]
    else:
        print("Invalid Identity format")
        return jsonify({"error": "Invalid Identity format"}), 400

    try:
        if role == "admin":
            joined_students = ClassroomUser.query.all()
            joined_student = [
                {
                    "joinedClassroomId": j.classroom_id,
                    "joinedStudentId": j.user_id,
                    "joinedRollNo": j.roll_no,
                    "joinedEmail": j.user_email,
                    'studentJoinedAt': j.joined_at
                }
                for j in joined_students
            ]
            return jsonify({"joinedStudent": joined_student}), 200
        else:
            print("Invalid Role for fetching classrooms")
            return jsonify({"error": "Invalid Role for fetching classroom"}), 400

    except Exception as err:
        print(f"Error fetching Students Joined in classroom: {str(err)}")
        return (
            jsonify(
                {"error": f"Error fetching Student joined in classroom: {str(err)}"}
            ),
            400,
        )


def fetch_faceData():
    header = request.headers.get("Authorization")
    identity = get_identity_from_header(header)
    if identity:
        role = identity["role"]
    else:
        print("Invalid Identity format")
        return jsonify({"error": "Invalid Identity format"}), 400

    try:
        if role == 'admin':
            face_datas = Face_data.query.all()
            face_data = [
                {
                    'faceStudentId': f.user_id,
                    'faceStudentRollNo': f.roll_no,
                    'faceStudentImagePath': f.image_path,
                    'faceStudentEncodingPath': f.encoding_path,
                    'faceCreatedAt': f.created_at
                }for f in face_data
            ]
        else:
            print("Invalid Role for fetching classrooms")
            return jsonify({"error": "Invalid Role for fetching classroom"}), 400

    except Exception as err:
        print(f"Error fetching faceData: {str(err)}")
        return jsonify({"error": f"Error fetching faceData: {str(err)}"}), 400


def fetch_attendance():
    pass

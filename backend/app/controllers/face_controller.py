from flask import jsonify, request
from ast import literal_eval
from app.extentions import db
import face_recognition
import cv2
import face_recognition
import numpy as np
import os
from werkzeug.utils import secure_filename
from app.extentions import db
from app.models.user import User
from app.models.face_data import Face_data
from app.utils.jwt_utils import decode_token
import json, shutil
from datetime import datetime, timezone


def cleanup_temp_files(temp_path):
    try:
        if os.path.exists(temp_path):
            shutil.rmtree(temp_path)
    except Exception as e:
        print(f"Failed to cleanup temp files: {str(e)}")
        return


def cleanup_existing_files(face_data):
    try:
        if face_data.image_path and os.path.exists(face_data.image_path):
            os.remove(face_data.image_path)

        if face_data.encoding_path and os.path.exists(face_data.encoding_path):
            os.remove(face_data.encoding_path)

        if face_data.image_path:
            directory = os.path.dirname(face_data.image_path)
            if os.path.exists(directory) and not os.listdir(directory):
                os.rmdir(directory)

    except Exception as e:
        print(f"Failed to cleanup existing files: {str(e)}")
        return


def register_face():
    raw_roll_no = request.form.get("rollNo")
    try:
        roll_no_dict = literal_eval(raw_roll_no)
        roll_no = int(roll_no_dict["rollNo"])
    except:
        return jsonify({"error", "invalid roll no"}), 400

    header = request.headers.get("Authorization")
    token = header.split()[1]

    if not token:
        return jsonify({"error": "No token in authorization headers"}), 400

    decoded_token = decode_token(token)

    if decoded_token["sub"]:
        identity = decoded_token["sub"]

    identity = json.loads(identity)

    if isinstance(identity, dict):
        student_id = identity["userId"]
    else:
        return jsonify({"error": "Invalid identity format in token"})

    if "image" not in request.files or not student_id or not roll_no:
        return jsonify({"error": "Missing face image or rollno or student id"}), 400

    replace_existing = request.form.get("repalceExisting", "false").lower() == "true"

    existing_face_data = Face_data.query.filter_by(user_id=student_id).first()

    if existing_face_data and not replace_existing:
        return jsonify(
            {
                "error": "Face Already Registered",
                "message": "You have already registered your face. Do you want to replace it with a new one?",
                "requiresConfirmation": True,
                "existingRegistration": {"rollNo": existing_face_data.roll_no},
            }
        ), 409

    root_path = "face_data"
    student_folder_name = f"{roll_no}_{student_id}"
    student_path = os.path.join(root_path, student_folder_name)

    temp_path = os.path.join(root_path, f'temp_{student_folder_name}')
    os.makedirs(temp_path, exist_ok=True)

    # os.makedirs(student_path, exist_ok=True)

    image_file = request.files["image"]
    image_filename = secure_filename(image_file.filename)
    temp_image_path = os.path.join(temp_path, image_filename)
    # image_path = os.path.join(student_path, image_filename)
    image_file.save(temp_image_path)

    try:
        image = cv2.imread(temp_image_path)
        if image is None:
            cleanup_temp_files(temp_path)
            return jsonify({"error": "Invalid image file!!!"}), 400

        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        face_location = face_recognition.face_locations(rgb_image)
        if len(face_location) == 0:
            cleanup_temp_files(temp_path)
            return (
                jsonify(
                    {
                        "error": "No face Detected",
                        "suggestion": "Ensure your face is clearly visible with good lighting",
                    }
                ),
                400,
            )

        if len(face_location) > 1:
            cleanup_temp_files(temp_path)
            return (
                jsonify(
                    {
                        "error": "Multiple face Detected",
                        "suggestion": "Please ensure only your face is in the image",
                    }
                ),
                400,
            )

        top, right, bottom, left = face_location[0]
        face_image = rgb_image[top:bottom, left:right]
        face_width = right - left
        face_height = bottom - top
        aspect_ratio = face_width / face_height
        h, w, _ = rgb_image.shape

        if face_width < w * 0.2 or face_height < h * 0.2:
            cleanup_temp_files(temp_path)
            return (
                jsonify(
                    {
                        "error": "Face is too small",
                        "suggestion": "Move closer to camera",
                    }
                ),
                400,
            )

        if aspect_ratio < 0.7 or aspect_ratio > 1.3:
            cleanup_temp_files(temp_path)
            return (
                jsonify(
                    {
                        "error": "Face angle too extreme",
                        "suggestion": "Look directly at the angle",
                    }
                ),
                400,
            )

        face_center_x = (left + right) / 2
        face_center_y = (bottom + top) / 2
        if not (
            w * 0.3 < face_center_x < w * 0.7 and h * 0.3 < face_center_y < h * 0.7
        ):
            cleanup_temp_files(temp_path)
            return (
                jsonify(
                    {
                        "error": "Face is not centered",
                        "suggestion": "Please center your face in the frame",
                    }
                ),
                400,
            )

        gray_face = cv2.cvtColor(face_image, cv2.COLOR_RGB2GRAY)
        brightness = np.mean(gray_face)

        if brightness < 50:
            cleanup_temp_files(temp_path)
            return (
                jsonify(
                    {
                        "error": "Image too Dark",
                        "suggestion": "Take the picture in better lighting conditions.",
                    }
                ),
                400,
            )

        if brightness > 200:
            cleanup_temp_files(temp_path)
            return (
                jsonify(
                    {
                        "error": "Image too bright",
                        "suggestion": "Avoid direct light on your face",
                    }
                ),
                400,
            )

        blur_value = cv2.Laplacian(gray_face, cv2.CV_64F).var()
        if blur_value < 100:
            cleanup_temp_files(temp_path)
            return (
                jsonify(
                    {
                        "error": "Image too blurry",
                        "suggestion": "Hold the camera steady or use higher resolution",
                    }
                ),
                400,
            )

        image = face_recognition.load_image_file(temp_image_path)
        face_encoding = face_recognition.face_encodings(image)

        if len(face_encoding) != 1:
            cleanup_temp_files(temp_path)
            return jsonify({"error": "Image must contain exactly one face"}), 400

        encoding = face_encoding[0]
        temp_encoding_path = os.path.join(temp_path, "encoding.npy")
        np.save(temp_encoding_path, encoding)

        try:
            if existing_face_data and replace_existing:
                cleanup_existing_files(existing_face_data)
                os.makedirs(student_path, exist_ok=True)

                final_image_path = os.path.join(student_path, image_filename)
                final_encoding_path = os.path.join(student_path, 'encoding.npy')

                shutil.move(temp_image_path, final_image_path)
                shutil.move(temp_encoding_path, final_encoding_path)

                existing_face_data.roll_no = roll_no
                existing_face_data.image_path = final_image_path
                existing_face_data.encoding_path = final_encoding_path
                existing_face_data.created_at = datetime.now(timezone.utc)

                db.session.commit()
                cleanup_temp_files(temp_path)

                return jsonify({
                    'message': 'Face registration updated successfully',
                    'action': 'replaced'
                }), 200
            
            else:
                os.makedirs(student_path, exist_ok=True)
                final_image_path = os.path.join(student_path, image_filename)
                final_encoding_path = os.path.join(student_path, 'encoding.npy')

                shutil.move(temp_image_path, final_image_path)
                shutil.move(temp_encoding_path, final_encoding_path)

                face_data = Face_data(
                    user_id = student_id,
                    roll_no = roll_no,
                    image_path = final_image_path,
                    encoding_path = final_encoding_path
                )
                db.session.add(face_data)
                db.session.commit()
                cleanup_temp_files(temp_path)

                return jsonify({
                    'message': 'Face Registered Successfully',
                    'action': 'created'
                }), 200

        except Exception as error:
            print("Database Error", str(error))
            cleanup_temp_files(temp_path)
            db.session.rollback()
            return jsonify({"error": "Failed to save face registration"}), 403
    except Exception as error:
        print("Image processing failed: ", str(error))
        return jsonify({"error": "Image processing failed."}), 400

    return jsonify({"message": "Face Registered Successfully"}), 200


def get_face_registration_status():
    header = request.headers.get("Authorization")
    if not header:
        return jsonify({"error": "No authorization header"}), 400

    token = header.split()[1]
    decoded_token = decode_token(token)

    if decoded_token["sub"]:
        identity = json.loads(decoded_token["sub"])
        student_id = identity["userId"]

        existing_registration = Face_data.query.filter_by(user_id=student_id).first()

        if existing_registration:
            return (
                jsonify(
                    {
                        "hasRegistration": True,
                        "registration": {
                            "rollNo": existing_registration.roll_no,
                        },
                    }
                ),
                200,
            )
        else:
            return jsonify({"hasRegistration": False}), 200

    return jsonify({"error": "Invalid Token"}), 400

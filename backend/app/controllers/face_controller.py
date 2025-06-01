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
import json


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

    root_path = "face_data"
    student_folder_name = f"{roll_no}_{student_id}"
    student_path = os.path.join(root_path, student_folder_name)
    os.makedirs(student_path, exist_ok=True)

    image_file = request.files["image"]
    image_filename = secure_filename(image_file.filename)
    image_path = os.path.join(student_path, image_filename)
    image_file.save(image_path)

    try:
        image = cv2.imread(image_path)
        if image is None:
            os.remove(image_path)
            os.rmdir(student_path)
            return jsonify({"error": "Invalid image file!!!"}), 400

        rgb_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        face_location = face_recognition.face_locations(rgb_image)
        if len(face_location) == 0:
            os.remove(image_path)
            os.rmdir(student_path)
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
            os.remove(image_path)
            os.rmdir(student_path)
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
            os.remove(image_path)
            os.rmdir(student_path)
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
            os.remove(image_path)
            os.rmdir(student_path)
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
            os.remove(image_path)
            os.rmdir(student_path)
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
            os.remove(image_path)
            os.rmdir(student_path)
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
            os.remove(image_path)
            os.rmdir(student_path)
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
            os.remove(image_path)
            os.rmdir(student_path)
            return (
                jsonify(
                    {
                        "error": "Image too blurry",
                        "suggestion": "Hold the camera steady or use higher resolution",
                    }
                ),
                400,
            )

        image = face_recognition.load_image_file(image_path)
        face_encoding = face_recognition.face_encodings(image)

        if len(face_encoding) != 1:
            os.remove(image_path)
            os.rmdir(student_path)
            return jsonify({"error": "Image must contain exactly one face"}), 400

        encoding = face_encoding[0]
        encoding_path = os.path.join(student_path, "encoding.npy")
        np.save(encoding_path, encoding)

        try:
            face_data = Face_data(
                user_id=student_id,
                roll_no=roll_no,
                image_path=image_path,
                encoding_path=encoding_path,
            )
            db.session.add(face_data)
            db.session.commit()
        except Exception as error:
            print("error whiel registering in db", str(error))
            return jsonify({"error": "You have already registered your face"}), 403
    except Exception as error:
        print('Image processing failed: ', str(error))
        return jsonify({'error': 'Image processing failed.'}), 400

    return jsonify({"message": "Face Registered Successfully"}), 200

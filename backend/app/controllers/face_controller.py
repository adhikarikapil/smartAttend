from flask import jsonify, request
from app.extentions import db
import face_recognition
import numpy as np
import os
from werkzeug.utils import secure_filename
from app.models.user import User
from app.utils.jwt_utils import decode_token
import json


def register_face():
    roll_no = request.form.get('rollNo')

    header = request.headers.get('Authorization')
    token = header.split()[1]

    if not token: 
        return jsonify({'error': 'No token in authorization headers'}), 400
    
    decoded_token = decode_token(token)

    if decoded_token['sub']:
        identity = decoded_token['sub']

    identity = json.loads(identity)

    if isinstance(identity, dict):
        student_id = identity['userId']
    else:
        return jsonify({'error': 'Invalid identity format in token'})
    

    if 'image' not in request.files or not student_id or not roll_no:
        return jsonify({'error': 'Missing face image or rollno or student id'}), 400

    image_file = request.files['image']
    image_path = f'/tmp/{secure_filename(image_file.filename)}'
    image_file.save(image_path)

    image = face_recognition.load_image_file(image_path)
    face_encoding = face_recognition.face_encodings(image)

    if len(face_encoding) != 1:
        return jsonify({'error': 'Image must contain exactly one face'}), 400
    
    encoding = face_encoding[0]

    root_path = 'face_data'
    student_folder_name = f"{roll_no}_{student_id}"
    student_path = os.path.join(root_path, student_folder_name)
    os.makedirs(student_path, exist_ok=True)

    np.save(os.path.join(student_path, 'encoding.npy'), encoding)

    return jsonify({'message': 'Face Registered Successfully'}), 200



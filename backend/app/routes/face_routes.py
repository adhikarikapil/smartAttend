from flask import Blueprint
from app.controllers.face_controller import (
    register_face,
    get_face_registration_status
)

face_bp = Blueprint('face', __name__)

face_bp.route('/register', methods=["POST"])(register_face)
face_bp.route('/status', methods=["GET"])(get_face_registration_status)
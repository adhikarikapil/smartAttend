from flask import Blueprint
from app.controllers.attendance_controller import (
    load_all_encodings,
    mark_absent_students
)


attendance_bp = Blueprint('attendance', __name__)

attendance_bp.route('/listface', methods=["GET"])(load_all_encodings)
attendance_bp.route('/mark-absent', methods=["POST"])(mark_absent_students)
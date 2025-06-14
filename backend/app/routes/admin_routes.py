from flask import Blueprint
from app.controllers.admin_controller import (
    fetch_user,
    fetch_classrooms,
    fetch_classroomUser,
    fetch_attendance,
    fetch_faceData
)

admin_bp = Blueprint('admin', __name__)

admin_bp.route('/fetch-user', methods=["GET"])(fetch_user)
admin_bp.route('/fetch-classroom', methods=["GET"])(fetch_classrooms)
admin_bp.route('/fetch-classroomuser', methods=["GET"])(fetch_classroomUser)
admin_bp.route('/fetch-facedata', methods=["GET"])(fetch_faceData)
admin_bp.route('/fetch-attendance', methods=["GET"])(fetch_attendance)
from flask import Blueprint
from app.controllers.classroom_controller import (
    create_classroom,
    join_classroom
)

classroom_bp = Blueprint('classroom', __name__)

classroom_bp.route('/create', methods=["POST"])(create_classroom)
classroom_bp.route('/join', methods=["POST"])(join_classroom)
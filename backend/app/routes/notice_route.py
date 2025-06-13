from flask import Blueprint
from app.controllers.notice_controller import (
    add_notice, 
    list_notice
)

notice_bp = Blueprint('notice', __name__)

notice_bp.route('/add', methods=["POST"])(add_notice)
notice_bp.route('/list', methods=["GET"])(list_notice)
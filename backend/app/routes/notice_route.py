from flask import Blueprint
from app.controllers.notice_controller import (
    add_notice, 
    list_notice,
    unseen_notice_count,
    mark_notices_seen,
    delete_notice
)

notice_bp = Blueprint('notice', __name__)

notice_bp.route('/add', methods=["POST"])(add_notice)
notice_bp.route('/list', methods=["GET"])(list_notice)
notice_bp.route('/unseen', methods=["POST"])(unseen_notice_count)
notice_bp.route('/seen', methods=["POST"])(mark_notices_seen)
notice_bp.route('/delete', methods=["POST"])(delete_notice)

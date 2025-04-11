from flask import Blueprint
from app.controllers.classroom_controller import (
    create_classroom,
    join_classroom,
    list_classroom,
    leave_class,
    dismiss_class,
    student_list
)

classroom_bp = Blueprint("classroom", __name__)

classroom_bp.route("/create", methods=["POST"])(create_classroom)
classroom_bp.route("/join", methods=["POST"])(join_classroom)
classroom_bp.route("/list", methods=["GET"])(list_classroom)
classroom_bp.route("/leave/<int:classroom_id>", methods=["DELETE"])(leave_class)
classroom_bp.route("dismiss/<int:classroom_id>", methods=["DELETE"])(dismiss_class)
classroom_bp.route('list/<int:classroom_id>', methods=["GET"])(student_list)

from flask import Blueprint
from app.controllers.auth_controller import (
    register_user,
    login_user,
    refresh_token,
    logout_user,
    test_blacklist,
    token_checking,
)

auth_bp = Blueprint("auth", __name__)

# Register routes to the blueprints
auth_bp.route("/register", methods=["POST"])(register_user)
auth_bp.route("/login", methods=["POST"])(login_user)
auth_bp.route("/refresh", methods=["POST"])(refresh_token)
auth_bp.route("/logout", methods=["POST"])(logout_user)
auth_bp.route("/test-blacklist", methods=["GET"])(test_blacklist)
auth_bp.route('/token', methods=["GET"])(token_checking)
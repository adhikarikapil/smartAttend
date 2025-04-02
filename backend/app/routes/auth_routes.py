from flask import Blueprint
from app.controllers.auth_controller import register_user

auth_bp = Blueprint('auth', __name__)

# Register routes to the blueprints
auth_bp.route('/register', methods=["POST"])(register_user)
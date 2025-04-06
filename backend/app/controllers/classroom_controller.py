from flask import request, jsonify
from app.extentions import db
from app.models.classroom import Classroom, ClassroomUser

#handle http request for creating classroom 
def create_classroom():
    data = request.get_json()

    name = data.get('className')
    code = data.get('code')

    if not name or not code:
        return jsonify({'error': 'Missing required Field'})
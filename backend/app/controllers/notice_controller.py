from flask import request, jsonify
from app.extentions import db
from app.models import Notice


def notice():
    header = request.headers.get('Authorization')
    if not header:
        return jsonify({'error': 'No header Authorization'})

    token = header.split(' ')[1]
    

    data = request.get_json()
    title = data.get('title')
    message = data.get('message')


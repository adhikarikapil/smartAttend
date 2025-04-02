from app.extentions import db
from datetime import datetime, timezone
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    second_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))

    refresh_token = db.relationship('Refresh_token', backref='user', lazy=True, cascade='all, delete-orphan')

    def __init__(self, first_name, second_name, email, password, role):
        self.first_name = first_name
        self.second_name = second_name
        self.email = email
        self.password = generate_password_hash(password)
        self.role = role.lower()


    def check_password(self, password):
        return check_password_hash(self.password, password)
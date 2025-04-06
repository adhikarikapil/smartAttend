from app.extentions import db
from datetime import datetime, timezone

class Classroom(db.Model):
    __tablename__ = 'classrooms'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    code = db.Column(db.String(10), nullable=False, unique=True)
    description = db.Column(db.String(500), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))

    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    creator = db.relationship('User', backref='created_classrooms')
    members = db.relationship('ClassroomUser', backref='classroom', cascade='all, delete-orphan')

    def __init__(self, name, code, creator_id, description):
        self.name = name
        self.code = code
        self.creator_id = creator_id
        self.description = description



class ClassroomUser(db.Model):
    __tablename__ = 'classroom_users'

    id = db.Column(db.Integer, primary_key=True)
    joined_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))

    classroom_id = db.Column(db.Integer, db.ForeignKey('classrooms.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user_email = db.Column(db.String(120), nullable=False)

    user = db.relationship('User', backref='joined_classrooms')

    def __init__(self, classroom_id, user_id, user_email):
        self.classroom_id = classroom_id
        self.user_id = user_id
        self.user_email = user_email
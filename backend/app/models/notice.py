from app.extentions import db
from datetime import datetime, timezone

class Notice(db.Model):
    __tablename__ = 'notice'

    id = db.Column(db.Integer, primary_key=True)
    classroom_id = db.Column(db.Integer, db.ForeignKey('classrooms.id'), nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    title = db.Column(db.String(50), nullable=False)
    message = db.Column(db.String(250), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))

    user = db.relationship('User', backref='notice')
    classroom = db.relationship('Classroom', backref='notice')


    def __init__(self, classroom_id, teacher_id, title, message):
        self.classroom_id = classroom_id
        self.teacher_id = teacher_id
        self.title = title
        self.message = message

class NoticeSeen(db.Model):
    id  = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    notice_id = db.Column(db.Integer, db.ForeignKey('notice.id'), nullable=False)
    seen_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    
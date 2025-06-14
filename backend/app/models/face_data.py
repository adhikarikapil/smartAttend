from app.extentions import db
from datetime import datetime, timezone

class Face_data(db.Model):
    __tablename__ = 'facedata'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=True)
    roll_no = db.Column(db.Integer, nullable=False, unique=True)
    image_path = db.Column(db.String(500), nullable=False)
    encoding_path = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc))

    user = db.relationship('User', backref=db.backref('face_data', uselist=False))

    def __init__(self, user_id, roll_no, image_path, encoding_path):
        self.user_id = user_id
        self.roll_no = roll_no
        self.image_path = image_path
        self.encoding_path = encoding_path
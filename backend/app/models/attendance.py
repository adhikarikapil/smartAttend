from app.extentions import db
from datetime import datetime, timezone, date


class Attendance(db.Model):
    __tablename__ = "attendance"

    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    roll_no = db.Column(db.Integer, db.ForeignKey("facedata.roll_no"), nullable=False)
    classroom_id = db.Column(db.Integer, db.ForeignKey("classrooms.id"), nullable=False)
    taken_by = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    date = db.Column(db.Date, nullable=False, default=datetime.now(timezone.utc).date())
    status = db.Column(db.String(10), nullable=False)
    marked_at = db.Column(
        db.DateTime, nullable=False, default=datetime.now(timezone.utc)
    )
    remarks = db.Column(db.String(255))

    students = db.relationship("User", foreign_keys=[student_id])
    teacher = db.relationship("User", foreign_keys=[taken_by])
    classroom = db.relationship("Classroom", backref="attendance")

    def __init__(self, student_id, roll_no, classroom_id, taken_by, status, remarks):
        self.student_id = student_id
        self.roll_no = roll_no
        self.classroom_id = classroom_id
        self.taken_by = taken_by
        self.status = status
        self.remarks = remarks
from app.extentions import db
from datetime import datetime, timezone

class Refresh_token(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    token = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    
    def __init__(self, token, user_id):
        self.token = token
        self.user_id = user_id
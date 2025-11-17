from .extensions import db
from datetime import datetime

class DashboardMetric(db.Model):
    __tablename__ = 'dashboard_metrics'

    id = db.Column(db.Integer, primary_key=True)
    metric_name = db.Column(db.String, nullable=False)
    metric_value = db.Column(db.Integer, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

from flask import Blueprint, jsonify
from .models import DashboardMetric
from .extensions import db

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route("/")
def index():
    return "Dashboard service is running!"

@dashboard_bp.route("/api/dashboard-summary")
def dashboard_summary():
    metrics = DashboardMetric.query.all()
    data = [
        {
            "metric_name": m.metric_name,
            "metric_value": m.metric_value,
            "updated_at": m.updated_at.isoformat()
        }
        for m in metrics
    ]
    return jsonify(data)

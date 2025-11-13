from flask import Blueprint, jsonify, request, send_file
import requests
from .utils import generate_pdf, generate_excel
import io

export_bp = Blueprint("export", __name__)

FAMILY_URL = "http://family-service:5002/family"
TAX_URL = "http://tax-service:5003/tax"

@export_bp.route("/")
def index():
    return "Export Service is running!"

@export_bp.route("/export/pdf", methods=["GET"])
def export_pdf():
    family_data = requests.get(FAMILY_URL).json()
    tax_data = requests.get(TAX_URL).json()

    pdf_bytes = generate_pdf(family_data, tax_data)
    return send_file(
        io.BytesIO(pdf_bytes),
        mimetype="application/pdf",
        as_attachment=True,
        download_name="report.pdf"
    )

@export_bp.route("/export/excel", methods=["GET"])
def export_excel():
    family_data = requests.get(FAMILY_URL).json()
    tax_data = requests.get(TAX_URL).json()

    excel_bytes = generate_excel(family_data, tax_data)
    return send_file(
        io.BytesIO(excel_bytes),
        mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        as_attachment=True,
        download_name="report.xlsx"
    )

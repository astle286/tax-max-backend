import io
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import pandas as pd

def generate_pdf(family_data, tax_data):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    c.drawString(100, 750, "Tax-Max Report")
    c.drawString(100, 730, f"Families: {len(family_data)}")
    c.drawString(100, 710, f"Tax Records: {len(tax_data)}")
    c.save()
    buffer.seek(0)
    return buffer.read()

def generate_excel(family_data, tax_data):
    family_df = pd.DataFrame(family_data)
    tax_df = pd.DataFrame(tax_data)

    buffer = io.BytesIO()
    with pd.ExcelWriter(buffer, engine="xlsxwriter") as writer:
        family_df.to_excel(writer, sheet_name="Families", index=False)
        tax_df.to_excel(writer, sheet_name="Taxes", index=False)
    buffer.seek(0)
    return buffer.read()

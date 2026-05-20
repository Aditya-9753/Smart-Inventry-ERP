import os
import barcode
from barcode.writer import ImageWriter
import qrcode
from app.config import settings

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
IMAGES_DIR = os.path.join(UPLOAD_DIR, "images")
BARCODES_DIR = os.path.join(UPLOAD_DIR, "barcodes")
QRS_DIR = os.path.join(UPLOAD_DIR, "qrs")

# Ensure directories exist
os.makedirs(IMAGES_DIR, exist_ok=True)
os.makedirs(BARCODES_DIR, exist_ok=True)
os.makedirs(QRS_DIR, exist_ok=True)

def generate_barcode(sku: str) -> str:
    """Generate a Code128 barcode image and return the file path"""
    code128 = barcode.get('code128', sku, writer=ImageWriter())
    file_path = os.path.join(BARCODES_DIR, f"{sku}")
    code128.save(file_path)
    return f"/uploads/barcodes/{sku}.png"

def generate_qr_code(product_id: str, sku: str) -> str:
    """Generate a QR code image and return the file path"""
    data = f"ID:{product_id}|SKU:{sku}"
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    file_path = os.path.join(QRS_DIR, f"{sku}.png")
    img.save(file_path)
    return f"/uploads/qrs/{sku}.png"

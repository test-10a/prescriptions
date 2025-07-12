from PIL import Image
import pytesseract
import base64
import io
import json

def handler(request):
    try:
        body = request.body
        data = json.loads(body)

        # Get the base64 image
        img_data = base64.b64decode(data["imageBase64"])

        # Convert to image
        image = Image.open(io.BytesIO(img_data))

        # Run OCR
        text = pytesseract.image_to_string(image)

        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"text": text})
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }


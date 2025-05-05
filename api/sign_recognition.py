# api/sign_recognition.py
from flask import Flask, request, jsonify
import cv2
import numpy as np
import base64

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        image_data = request.json.get('image')
        img_bytes = base64.b64decode(image_data.split(',')[1])
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Your existing prediction logic
        prediction = model.predict(preprocess_image(img))
        return jsonify({'sign': prediction})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
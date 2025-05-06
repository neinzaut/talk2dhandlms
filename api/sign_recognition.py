# api/sign_recognition.py
import os
import absl.logging
import tensorflow as tf
from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import mediapipe as mp
import numpy as np
from tensorflow.keras.models import load_model
import base64
import io
from PIL import Image

# Disable TensorFlow logging
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
absl.logging.set_verbosity(absl.logging.ERROR)
tf.get_logger().setLevel('ERROR')

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize MediaPipe
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=1,
    min_detection_confidence=0.5,
    min_tracking_confidence=0.5
)
mp_drawing = mp.solutions.drawing_utils

# Define classes
classes = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
           'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
           'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
           'U', 'V', 'W', 'X', 'Y', 'Z']

# Load the model
try:
    model = load_model("hand_landmarks.h5")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

def process_image(image_data):
    try:
        # Convert base64 to image
        image_bytes = base64.b64decode(image_data.split(',')[1])
        image = Image.open(io.BytesIO(image_bytes))
        image_np = np.array(image)
        
        # Convert to RGB
        image_rgb = cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB)
        
        # Process with MediaPipe
        results = hands.process(image_rgb)
        
        if results.multi_hand_landmarks:
            # Create a copy of the image for drawing
            annotated_image = image_rgb.copy()
            
            # Draw hand landmarks
            for hand_landmarks in results.multi_hand_landmarks:
                mp_drawing.draw_landmarks(
                    annotated_image,
                    hand_landmarks,
                    mp_hands.HAND_CONNECTIONS,
                    mp_drawing.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                    mp_drawing.DrawingSpec(color=(0, 0, 255), thickness=2)
                )
            
            # Convert annotated image to base64
            _, buffer = cv2.imencode('.jpg', cv2.cvtColor(annotated_image, cv2.COLOR_RGB2BGR))
            annotated_image_base64 = base64.b64encode(buffer).decode('utf-8')
            
            landmarks = []
            for hand_landmarks in results.multi_hand_landmarks:
                for landmark in hand_landmarks.landmark:
                    landmarks.append([landmark.x, landmark.y, landmark.z])
            
            # Reshape for model input
            input_data = np.array(landmarks).reshape(1, 21, 3)
            
            # Get prediction
            prediction = model.predict(input_data)
            predicted_class = np.argmax(prediction, axis=1)[0]
            predicted_character = classes[predicted_class]
            
            return {
                'success': True,
                'prediction': predicted_character,
                'confidence': float(np.max(prediction)),
                'annotated_image': f'data:image/jpeg;base64,{annotated_image_base64}',
                'landmarks': landmarks
            }
        else:
            return {
                'success': False,
                'error': 'No hand detected'
            }
            
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({
                'success': False,
                'error': 'No image data provided'
            }), 400
            
        result = process_image(data['image'])
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
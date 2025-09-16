from flask import Flask, request, jsonify
from flask_cors import CORS
from utils import analyze_sentiment
import csv
from datetime import datetime

app = Flask(__name__)
CORS(app)

# In-memory storage (replace with database in production)
comments = []

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    text = data['text']
    result = analyze_sentiment(text)

    # Store comment with detailed analysis
    comments.append({
        "text": text,
        "sentiment": result["label"],
        "confidence": result["confidence"],
        "scores": result["scores"],
        "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    })

    return jsonify({
        "sentiment": result["label"],
        "confidence": result["confidence"],
        "scores": result["scores"]
    })

@app.route('/dashboard', methods=['GET'])
def dashboard():
    return jsonify(comments)

@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty file"}), 400

    if file and file.filename.endswith('.csv'):
        stream = file.stream.read().decode("UTF8")
        csv_reader = csv.reader(stream.splitlines())
        for row in csv_reader:
            if len(row) > 0:
                text = row[0]
                result = analyze_sentiment(text)
                comments.append({
                    "text": text,
                    "sentiment": result["label"],
                    "confidence": result["confidence"],
                    "scores": result["scores"],
                    "date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                })

        return jsonify({"message": f"Processed {len(row)} comments!"})
    else:
        return jsonify({"error": "Invalid file format"}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)

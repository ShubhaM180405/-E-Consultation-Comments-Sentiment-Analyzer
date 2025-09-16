from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import numpy as np

# Load pre-trained BERT model fine-tuned for 5-class sentiment
model_name = "nlptown/bert-base-multilingual-uncased-sentiment"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

def analyze_sentiment(text):
    # Tokenize input
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)

    # Get model predictions
    with torch.no_grad():
        outputs = model(**inputs)

    # Convert outputs to probabilities
    probs = torch.nn.functional.softmax(outputs.logits, dim=-1).numpy()[0]

    # Map probabilities to custom 5-class labels
    # Original model outputs: 1 (negative) to 5 (positive)
    # We remap to: Negative, Neutral-, Neutral, Neutral+, Positive
    scores = {
        "Negative": probs[0],  # 1-star
        "Neutral but dominantly negative": probs[1],  # 2-star
        "Neutral": probs[2],   # 3-star
        "Neutral but dominantly positive": probs[3],  # 4-star
        "Positive": probs[4]    # 5-star
    }

    # Get the dominant label
    dominant_label = max(scores, key=scores.get)
    confidence = scores[dominant_label]

    return {
        "label": dominant_label,
        "confidence": float(confidence),
        "scores": {k: float(v) for k, v in scores.items()}
    }

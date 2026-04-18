import secrets
import string
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

def check_strength(password):
    """
    Simple strength checker.
    Returns a score from 0-4 and a label.
    """
    score = 0
    length = len(password)
    
    if length >= 8: score += 1
    if length >= 12: score += 1
    if any(char in string.ascii_lowercase for char in password) and \
       any(char in string.ascii_uppercase for char in password):
        score += 1
    if any(char in string.digits for char in password):
        score += 1
    if any(char in string.punctuation for char in password):
        score += 0.5 # Bonus for symbols
        
    score = min(4, int(score))
    
    labels = ["Weak", "Fair", "Good", "Strong", "Very Strong"]
    return {"score": score, "label": labels[score]}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    data = request.json
    length = data.get('length', 12)
    
    # Ensure length is within reasonable bounds
    length = max(4, min(128, int(length)))
    
    alphabet = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(secrets.choice(alphabet) for _ in range(length))
    
    strength = check_strength(password)
    
    return jsonify({
        "password": password,
        "strength": strength
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)

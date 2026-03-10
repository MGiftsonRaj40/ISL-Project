from flask import Flask, request, render_template, jsonify
from flask_cors import CORS
import nltk

nltk.download('punkt')
nltk.download('stopwords')

from utils.isl_processor import convert_to_isl

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    return render_template("index.html")

@app.route("/convert", methods=["POST"])
def convert():
    text = request.json.get("text", " ")
    isl_sequence = convert_to_isl(text)
    return jsonify({"isl": isl_sequence})

if __name__ == "__main__":
    app.run(debug=True)
from flask import Flask
from flask_cors import CORS
app = Flask(__name__)
app.secret_key = 'uhshhshhushhushh'
CORS(app, supports_credentials=True)

from flask import redirect, request, session
from flask_bcrypt import Bcrypt

from flask_app import app
from flask_app.models import user

bcrypt = Bcrypt(app)

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/test/<int:testId>')
def do_the_test(testId):
    print("testId: ", testId)
    print(testId + 3)
    return f"The cool result is {testId}"

@app.route('/test', methods=['POST'])
def test_post_request():
    print("Post data:")
    print(request.form['name'])
    return redirect('/')

from flask import  redirect, request
from flask_bcrypt import Bcrypt

from flask_app import app
from flask_app.models import user

bcrypt = Bcrypt(app)

@app.route("/login")
def login_and_registration():
    return {
        "login": "comin' soon",
        "registration": "you bet"
    }


@app.route("/register", methods=["POST"])
def register_user():
    data = {
        "first_name": request.form["first_name"],
        "last_name": request.form["last_name"],
        "email": request.form["email"],
        "password": request.form["password"]
    }

    pw_hash = bcrypt.generate_password_hash(request.form['password'])
    data["password"] = pw_hash
    user.User.save(data)

    return redirect("/dashboard")


@app.route("/dashboard")
def dashboard():
    data = {"id": 1}
    current_user = user.User.get_one(data)
    return {
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email": current_user.email,
        "password": current_user.password,
        "collections": current_user.collections
    }

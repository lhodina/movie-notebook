from flask import  redirect, request, jsonify
from flask_bcrypt import Bcrypt

from flask_app import app
from flask_app.models import user, movie

bcrypt = Bcrypt(app)

# @app.route("/login")
# def login_and_registration():
#     return {
#         "message": "loggin' on in, friend!"
#     }


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
    favorite_directors = user.User.get_favorite_directors(data)
    favorite_critics = user.User.get_favorite_critics(data)
    reviews = user.User.get_reviews(data)

    userJSON = {
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email": current_user.email,
        "password": current_user.password,
        "collections": current_user.collections,
        "favorite_directors": favorite_directors,
        "favorite_critics": favorite_critics,
        "reviews": reviews
    }
    
    return userJSON

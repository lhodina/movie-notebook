from flask import  redirect, request
from flask_bcrypt import Bcrypt

from flask_app import app
from flask_app.models import user, director

bcrypt = Bcrypt(app)

# @app.route("/login")
# def login_and_registration():
#     return {
#         "message": "loggin' on in, friend!"
#     }


@app.route("/register", methods=["POST"])
def register_user():
    data = {
        "first_name": request.json["first_name"],
        "last_name": request.json["last_name"],
        "email": request.json["email"],
        "password": request.json["password"],
        "confirm_password": request.json["confirm_password"]
    }

    if not user.User.validate_user(data):
        return redirect("/")

    pw_hash = bcrypt.generate_password_hash(request.json['password'])
    data["password"] = pw_hash
    user_id = user.User.save(data)
    current_user = user.User.get_one(user_id)[0]
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

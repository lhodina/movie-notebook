from flask import redirect, request, session
from flask_bcrypt import Bcrypt

from flask_app import app
from flask_app.models import user

bcrypt = Bcrypt(app)

@app.route("/login")
def login_and_registration():
    return {
        "message": "loggin' on in, friend!"
    }


@app.route("/users/register", methods=["POST"])
def register_user():
    print("We've made it this far")
    print("request: ", request)
    data = {
        "first_name": request.json["firstName"],
        "last_name": request.json["lastName"],
        "email": request.json["email"],
        "password": request.json["password"],
        "confirm_password": request.json["confirmPassword"]
    }

    print("data: ", data)
    validation_messages = user.User.validate_user(data)
    if len(validation_messages) > 0:
        print("validation_messages: ", validation_messages)
        return {"validation_messages": validation_messages}
    else:
        print("* * * * * USER REGISTRATION VALIDATED")
        pw_hash = bcrypt.generate_password_hash(request.json['password'])
        data["password"] = pw_hash
        user_id = user.User.save(data)
        current_user = user.User.get_one({"id": user_id})
        print("current_user: ", current_user)

        return redirect("/dashboard")


@app.route("/dashboard")
def dashboard():
    data = {"id": 1}
    current_user = user.User.get_one(data)
    favorite_directors = user.User.get_favorite_directors(data)
    favorite_critics = user.User.get_favorite_critics(data)
    reviews = user.User.get_reviews(data)
    watched = list(filter(lambda d: d['watched'] == 1, reviews))
    unwatched = list(filter(lambda d: d['watched'] == 0, reviews))

    userJSON = {
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "email": current_user.email,
        "password": current_user.password,
        "collections": current_user.collections,
        "favorite_directors": favorite_directors,
        "favorite_critics": favorite_critics,
        "reviews": reviews,
        "watched": watched,
        "unwatched": unwatched
    }

    return userJSON

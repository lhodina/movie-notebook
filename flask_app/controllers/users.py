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

    # Add data to session before form submit, in case there are validation errors and you want to persist input fields
    # session["registering"] = True
    # session["data"] = data
    validation_messages = user.User.validate_user(data)
    if len(validation_messages) > 0:
        print("validation_messages: ", validation_messages)
        return {"validation_messages": validation_messages}
    else:
        print("* * * * * USER REGISTRATION VALIDATED")
        # If you made it this far, congratulations -- remove all form input data
        session.clear()
        pw_hash = bcrypt.generate_password_hash(request.json['password'])
        data["password"] = pw_hash
        user_id = user.User.save(data)
        print("user_id: ", user_id)
        current_user = user.User.get_one({"id": user_id})
        print("current_user: ", current_user)
        print("current_user.id", current_user.id)
        print("current_user.first_name", current_user.first_name)
        print("current_user.last_name", current_user.last_name)
        print("current_user.email", current_user.email)
        print("current_user.password", current_user.password)
        # session["user_id"] = current_user.id
        session["user"] = {
            "id": current_user.id,
            "first_name": current_user.first_name,
            "last_name": current_user.last_name
        }
        print("session: ", session)
        print("session['user']: ", session["user"])
        print("session['user']['id']: ", session['user']['id'])
        # session["user"] = current_user
        # print("session['user']: ", session['user'])
        # print("session['current_user'].id: ", session["current_user"].id)
        # print("session['current_user'].first_name: ", session["current_user"].first_name)
        session.modified = True
        # return redirect("/dashboard")
        return {"testing response": "testtest"}


@app.route("/dashboard")
def dashboard():
    print("session: ", session)
    if session and session["user"]:
        data = {
            "id": session["user"]["id"]
        }
    else:
        return redirect("/login")

    favorite_directors = user.User.get_favorite_directors(data)
    favorite_critics = user.User.get_favorite_critics(data)
    reviews = user.User.get_reviews(data)
    watched = list(filter(lambda d: d['watched'] == 1, reviews))
    unwatched = list(filter(lambda d: d['watched'] == 0, reviews))

    userJSON = {
        "first_name": session['user']['first_name'],
        # "collections": current_user.collections,
        "favorite_directors": favorite_directors,
        "favorite_critics": favorite_critics,
        "reviews": reviews,
        "watched": watched,
        "unwatched": unwatched
    }

    return userJSON


@app.route("/users/logout")
def logout():
    session.clear()
    print("Did clearing session work? session: ", session)
    return redirect("/login")

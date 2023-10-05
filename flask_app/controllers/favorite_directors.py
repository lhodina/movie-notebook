from flask import redirect, request

from flask_app import app
from flask_app.models import favorite_director


@app.route("/favorite_directors", methods=["POST"])
def add_favorite_director():
    data = {
        "notes": request.form["notes"],
        "director_id": request.form["director_id"],
        "user_id": request.form["user_id"]
    }

    favorite_director.FavoriteDirector.save(data)
    return redirect("/dashboard")


@app.route("/favorite_directors/remove/<int:director_id>")
def remove_favorite_director(director_id):
    # UPDATE USER ID
    data = {
        "director_id": director_id,
        "user_id": 1
    }
    favorite_director.FavoriteDirector.remove(data)
    return redirect("/dashboard")

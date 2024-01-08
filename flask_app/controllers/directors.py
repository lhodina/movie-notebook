from flask import redirect, request, session

from flask_app import app
from flask_app.models import user, director, favorite_director


@app.route("/directors", methods=["POST"])
def add_director():
    data = {
        "name": request.json["name"],
        "image_url": request.json["image_url"]
    }

    director.Director.save(data)
    return redirect("/dashboard")


@app.route("/directors/<int:director_id>")
def get_director(director_id):
    user_id = session["user"]["id"]
    data = {
        "id": director_id
    }

    current_director = director.Director.get_one(data)
    director_favorites = director.Director.get_favorites(data)
    user_favorite_director = favorite_director.FavoriteDirector.get_one(data)
    notes = ""
    if (len(user_favorite_director) > 0):
        notes = user_favorite_director[0]["notes"]
    links = director.Director.get_links(data)
    user_favorite_directors = user.User.get_favorite_directors({"id": user_id})
    user_favorite_critics = user.User.get_favorite_critics({"id": user_id})
    reviews = user.User.get_reviews({"id": user_id})

    return {
        "user_id": session["user"]["id"],
        "user_first_name": session["user"]["first_name"],
        "user_last_name": session["user"]["last_name"],
        "id": current_director.id,
        "name": current_director.name,
        "image_url": current_director.image_url,
        "movies_directed": current_director.movies_directed,
        "favorite_movies": director_favorites,
        "notes": notes,
        "links": links,
        "user_favorite_directors": user_favorite_directors,
        "user_favorite_critics": user_favorite_critics,
        "reviews": reviews
    }


@app.route("/update_director", methods=["POST"])
def update_director():
    data = {
        "id": request.json["director_id"],
        "name": request.json["name"],
        "image_url": request.json["image_url"]
    }

    director.Director.update(data)
    return redirect("/dashboard")


@app.route("/directors/<int:director_id>/add_favorite", methods=["POST"])
def add_director_favorite_movie(director_id):
    data = {
        "movie_id": request.json["movie_id"],
        "director_id": director_id
    }

    director.Director.add_favorite(data)
    return redirect("/dashboard")


@app.route("/directors/<int:director_id>/remove_favorite")
def remove_favorite(director_id):
    data = {
        "movie_id": request.json["movie_id"],
        "director_id": director_id
    }

    director.Director.remove_favorite(data)
    return redirect("/dashboard")

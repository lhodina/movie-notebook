from flask import redirect, request

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


@app.route("/directors")
def get_all_directors():
    all_directors = director.Director.get_all_directors()
    res = {"directors": []}
    for each_director in all_directors:
        res['directors'].append(each_director)
    return res


@app.route("/directors/<int:director_id>")
def get_director(director_id):
    data = {
        "id": director_id
    }

    current_director = director.Director.get_one(data)
    favorites = director.Director.get_favorites(data)
    current_user = user.User.get_one({"id": 1})
    favorite = favorite_director.FavoriteDirector.get_one(data)
    links = director.Director.get_links(data)

    return {
        "id": current_director.id,
        "name": current_director.name,
        "image_url": current_director.image_url,
        "movies_directed": current_director.movies_directed,
        "favorite_movies": favorites,
        "user_first_name": current_user.first_name,
        "user_last_name": current_user.last_name,
        "notes": favorite["notes"],
        "links": links
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


@app.route("/directors/delete/<int:director_id>")
def delete_director(director_id):
    data = { "id": director_id }
    director.Director.delete(data)
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


@app.route("/directors/<int:director_id>/links", methods=["POST"])
def add_link(director_id):
    data = {
        "user_id": request.json["user_id"],
        "director_id": director_id,
        "text": request.json["text"],
        "url": request.json["url"]
    }

    director.Director.add_link(data)
    return redirect(f"/directors/{director_id}")

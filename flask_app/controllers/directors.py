from flask import redirect, request

from flask_app import app
from flask_app.models import director


@app.route("/directors", methods=["POST"])
def add_director():
    data = {
        "name": request.form["name"],
        "image_url": request.form["image_url"]
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

    return {
        "id": current_director.id,
        "name": current_director.name,
        "image_url": current_director.image_url,
        "movies_directed": current_director.movies_directed,
        "favorite_movies": favorites
    }


@app.route("/update_director", methods=["POST"])
def update_director():
    data = {
        "id": request.form["director_id"],
        "name": request.form["name"],
        "image_url": request.form["image_url"]
    }

    director.Director.update(data)
    return redirect("/dashboard")


@app.route("/directors/delete/<int:director_id>")
def delete_director(director_id):
    data = { "id": director_id }
    director.Director.delete(data)
    return redirect("/dashboard")


@app.route("/directors/<int:director_id>/add_favorite", methods=["POST"])
def add_favorite(director_id):
    data = {
        "movie_id": request.form["movie_id"],
        "director_id": director_id
    }

    director.Director.add_favorite(data)
    return redirect("/dashboard")


@app.route("/directors/<int:director_id>/remove_favorite")
def remove_favorite(director_id):
    data = {
        "movie_id": request.form["movie_id"],
        "director_id": director_id
    }

    director.Director.remove_favorite(data)
    return redirect("/dashboard")

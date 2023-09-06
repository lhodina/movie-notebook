
from flask import redirect, request

from flask_app import app
from flask_app.models import movie


@app.route("/movies", methods=["POST"])
def add_movie():
    data = {
        "title": request.form["title"],
        "year": request.form["year"],
        "image_url": request.form["image_url"],
        "directed_by_id": request.form["directed_by_id"]
    }

    movie.Movie.save(data)
    return redirect("/dashboard")


@app.route("/movies")
def get_all_movies():
    all_movies = movie.Movie.get_all_movies()
    res = {"movies": []}
    for each_movie in all_movies:
        res['movies'].append(each_movie)

    return res


@app.route("/movies/<int:movie_id>")
def get_movie(movie_id):
    data = {
        "id": movie_id
    }
    current_movie = movie.Movie.get_one(data)
    print("current_movie.title: ", current_movie.title)
    return {
        "title": current_movie.title,
        "year": current_movie.year,
        "image_url": current_movie.image_url,
        "directed_by_id": current_movie.directed_by_id
    }


@app.route("/update_movie", methods=["POST"])
def update_movie():
    data = {
        "id": request.form["movie_id"],
        "title": request.form["title"],
        "year": request.form["year"],
        "image_url": request.form["image_url"],
        "directed_by_id": request.form["directed_by_id"]
    }

    movie.Movie.update(data)
    return redirect("/dashboard")


@app.route("/movies/delete/<int:movie_id>")
def delete_movie(movie_id):
    data = { "id": movie_id }
    movie.Movie.delete(data)
    return redirect("/dashboard")

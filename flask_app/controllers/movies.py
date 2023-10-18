import requests
from flask import redirect, request

from flask_app import app
from flask_app.models import movie


@app.route("/movie_api")
def test_movie_api():
    url_base = "https://image.tmdb.org/t/p/w500"
    url = "https://api.themoviedb.org/3/search/movie?query=la+dolce+vita"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZTIxNjdiZTgwYzYxYjZhMzVkNjhiMjY2NmE0YWUzMyIsInN1YiI6IjYzMmRkMzZkNTU5MzdiMDA3YzA5MTZlMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qlMgNrzDMM2eqPUGxDRpWsACr9o-xb94MKMpdta7K7c"
    }
    response = requests.get(url, headers=headers).json()
    poster_path = response["results"][0]["poster_path"]
    movie_poster = url_base + poster_path

    year = response["results"][0]["release_date"][:4]
    return response


@app.route("/director_api")
def test_person_api():
    image_url_base = "https://image.tmdb.org/t/p/w500"
    url = "https://api.themoviedb.org/3/search/person?query=federico+fellini"
    headers = {
        "accept": "application/json",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZTIxNjdiZTgwYzYxYjZhMzVkNjhiMjY2NmE0YWUzMyIsInN1YiI6IjYzMmRkMzZkNTU5MzdiMDA3YzA5MTZlMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qlMgNrzDMM2eqPUGxDRpWsACr9o-xb94MKMpdta7K7c"
    }
    response = requests.get(url, headers=headers).json()
    profile_path = response["results"][0]["profile_path"]
    profile_pic = image_url_base + profile_path
    return response



@app.route("/movies", methods=["POST"])
def add_movie():
    data = {
        "title": request.json["title"],
        "year": request.json["year"],
        "image_url": request.json["image_url"],
        "directed_by_id": request.json["directed_by_id"]
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
    return {
        "title": current_movie.title,
        "year": current_movie.year,
        "image_url": current_movie.image_url,
        "directed_by_id": current_movie.directed_by_id,
        "director_name": current_movie.director.name
    }


@app.route("/update_movie", methods=["POST"])
def update_movie():
    data = {
        "id": request.json["movie_id"],
        "title": request.json["title"],
        "year": request.json["year"],
        "image_url": request.json["image_url"],
        "directed_by_id": request.json["directed_by_id"]
    }

    movie.Movie.update(data)
    return redirect("/dashboard")


@app.route("/movies/delete/<int:movie_id>")
def delete_movie(movie_id):
    data = { "id": movie_id }
    movie.Movie.delete(data)
    return redirect("/dashboard")

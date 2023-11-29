import requests
from flask import redirect, request

from flask_app import app
from flask_app.models import movie, director, favorite_director, critic, favorite_critic, movie_link


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


# @app.route("/movies")
# def get_all_movies():
#     all_movies = movie.Movie.get_all_movies()
#     res = {"movies": []}
#     for each_movie in all_movies:
#         res['movies'].append(each_movie)
#     return res


# @app.route("/movies/<int:movie_id>")
# def get_movie(movie_id):
#     data = {
#         "id": movie_id
#     }
#     current_movie = movie.Movie.get_one(data)
#     return {
#         "title": current_movie.title,
#         "year": current_movie.year,
#         "image_url": current_movie.image_url,
#         "directed_by_id": current_movie.directed_by_id,
#         "director_name": current_movie.director.name
#     }


# @app.route("/update_movie", methods=["POST"])
# def update_movie():
#     data = {
#         "id": request.json["movie_id"],
#         "title": request.json["title"],
#         "year": request.json["year"],
#         "image_url": request.json["image_url"],
#         "directed_by_id": request.json["directed_by_id"]
#     }

#     movie.Movie.update(data)
#     return redirect("/dashboard")


@app.route("/movies/delete/<int:movie_id>")
def delete_movie(movie_id):
    data = { "id": movie_id }
    movie.Movie.delete(data)
    return redirect("/dashboard")


@app.route("/movies/<int:movie_id>/director_fans", methods=["POST"])
def add_director_fan(movie_id):
    user_id = 1
    name = request.json["name"].title()
    director_exists = director.Director.find_by_name({"name": name})
    director_id = 0
    if director_exists:
        current_director = director_exists[0]
        director_id = current_director["id"]
    else:
        print("director doesn't exist")
        api_key = "fe2167be80c61b6a35d68b2666a4ae33"
        api_director_results = requests.get(f"https://api.themoviedb.org/3/search/person?api_key={api_key}&query={name}").json()
        api_director = api_director_results["results"][0]
        image_url_base = "https://image.tmdb.org/t/p/w500"
        api_director_image_url = image_url_base + api_director["profile_path"]
        director_id = director.Director.save({
            "name": name,
            "image_url": api_director_image_url
            })
    favorite_director_exists = favorite_director.FavoriteDirector.get_one({"id": director_id})
    if not favorite_director_exists:
        favorite_director.FavoriteDirector.save({
            "notes": "No notes yet",
            "user_id": user_id,
            "director_id": director_id
        })
    data = {
        "movie_id": movie_id,
        "director_id": director_id
    }
    movie.Movie.add_director_fan(data)
    return data


@app.route("/movies/<int:movie_id>/critic_fans", methods=["POST"])
def add_critic_fan(movie_id):
    user_id = 1
    name = request.json["name"].title()
    critic_exists = critic.Critic.find_by_name({"name": name})
    critic_id = 0
    if critic_exists:
        current_critic = critic_exists[0]
        critic_id = current_critic["id"]
    else:
        print("critic doesn't exist")
        critic_id = critic.Critic.save({
            "name": name,
            "image_url": ""
            })
    favorite_critic_exists = favorite_critic.FavoriteCritic.get_one({"critic_id": critic_id})
    print("favorite_critic_exists: ", favorite_critic_exists)
    if not favorite_critic_exists:
        favorite_critic.FavoriteCritic.save({
            "notes": "No notes yet",
            "user_id": user_id,
            "critic_id": critic_id
        })
    data = {
        "movie_id": movie_id,
        "critic_id": critic_id
    }
    movie.Movie.add_critic_fan(data)
    return data


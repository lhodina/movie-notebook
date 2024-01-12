import requests
from flask import redirect, request, session

from flask_app import app
from flask_app.models import movie, director, favorite_director, critic, favorite_critic


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


@app.route("/movies/<int:movie_id>/director_fans", methods=["POST"])
def add_director_fan(movie_id):
    user_id = session["user"]["id"]
    print("controllers -- movies -- POST /movies/id/director_fans -- user_id: ", user_id)
    print()
    name = request.json["name"].title()
    director_exists = director.Director.find_by_name({"name": name})
    director_id = 0
    if director_exists:
        current_director = director_exists[0]
        director_id = current_director["id"]
    else:
        api_key = "fe2167be80c61b6a35d68b2666a4ae33"
        api_director_results = requests.get(f"https://api.themoviedb.org/3/search/person?api_key={api_key}&query={name}").json()
        api_director = api_director_results["results"][0]
        image_url_base = "https://image.tmdb.org/t/p/w500"
        api_director_image_url = image_url_base + api_director["profile_path"]
        director_id = director.Director.save({
            "name": name,
            "image_url": api_director_image_url
            })
    favorite_director_exists = favorite_director.FavoriteDirector.get_one({"id": director_id, "user_id": user_id})
    print("controllers -- movies -- POST /movies/id/director_fans -- favorite_director_exists: ", favorite_director_exists)
    print()
    if not favorite_director_exists:
        favorite_director.FavoriteDirector.save({
            "notes": "",
            "user_id": user_id,
            "director_id": director_id
        })
    data = {
        "movie_id": movie_id,
        "director_id": director_id
    }
    added_fan = movie.Movie.add_director_fan(data)
    print("Added director fan: ", added_fan)
    print()
    print("controllers -- movies -- POST /movies/id/director_fans -- data: ", data)
    print()
    return data


@app.route("/movies/<int:movie_id>/critic_fans", methods=["POST"])
def add_critic_fan(movie_id):
    user_id = session["user"]["id"]
    name = request.json["name"].title()
    critic_exists = critic.Critic.find_by_name({"name": name})
    critic_id = 0
    if critic_exists:
        current_critic = critic_exists[0]
        critic_id = current_critic["id"]
    else:
        critic_id = critic.Critic.save({
            "name": name,
            "image_url": ""
            })
    favorite_critic_exists = favorite_critic.FavoriteCritic.get_one({"critic_id": critic_id})
    if not favorite_critic_exists:
        favorite_critic.FavoriteCritic.save({
            "notes": "",
            "user_id": user_id,
            "critic_id": critic_id
        })
    data = {
        "movie_id": movie_id,
        "critic_id": critic_id
    }
    movie.Movie.add_critic_fan(data)
    return data

from flask import redirect, request, session

from flask_app import app
from flask_app.models import user, critic, favorite_critic

@app.route("/critics", methods=["POST"])
def add_critic():
    data = {
        "name": request.json["name"],
        "image_url": request.json["image_url"]
    }

    critic.Critic.save(data)
    return redirect("/dashboard")


@app.route("/critics/<int:critic_id>")
def get_critic(critic_id):
    user_id = session["user"]["id"]
    data = {
        "critic_id": critic_id
    }
    current_critic = critic.Critic.get_one(data)
    user_favorite_critic = favorite_critic.FavoriteCritic.get_one(data)[0]
    links = critic.Critic.get_links(data)

    user_favorite_directors = user.User.get_favorite_directors({"id": user_id})
    user_favorite_critics = user.User.get_favorite_critics({"id": user_id})
    reviews = user.User.get_reviews({"id": user_id})

    return {
        "user_id": session["user"]["id"],
        "user_first_name": session["user"]["first_name"],
        "user_last_name": session["user"]["last_name"],
        "id": current_critic.id,
        "name": current_critic.name,
        "image_url": current_critic.image_url,
        "favorite_movies": current_critic.favorite_movies,
        "notes": user_favorite_critic['notes'],
        "user_links": links,
        "user_favorite_directors": user_favorite_directors,
        "user_favorite_critics": user_favorite_critics,
        "reviews": reviews
    }

@app.route("/critics/<int:critic_id>/add_favorite", methods=["POST"])
def add_critic_favorite_movie(critic_id):
    data = {
        "movie_id": request.json["movie_id"],
        "critic_id": critic_id
    }

    critic.Critic.add_favorite(data)
    return redirect("/dashboard")


@app.route("/critics/<int:critic_id>/remove_favorite")
def remove_favorite_movie(critic_id):
    data = {
        "movie_id": request.json["movie_id"],
        "critic_id": critic_id
    }

    critic.Critic.remove_favorite(data)
    return redirect("/dashboard")

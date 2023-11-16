from flask import redirect, request

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


@app.route("/critics")
def get_all_critics():
    all_critics = critic.Critic.get_all_critics()
    res = {"critics": []}
    for each_critic in all_critics:
        res['critics'].append(each_critic)

    return res


@app.route("/critics/<int:critic_id>")
def get_critic(critic_id):
    data = {
        "critic_id": critic_id
    }

    current_critic = critic.Critic.get_one(data)

    favorites = critic.Critic.get_favorites(data)
    current_user = user.User.get_one({"id": 1})
    favorite = favorite_critic.FavoriteCritic.get_one(data)[0]
    links = critic.Critic.get_links(data)

    return {
        "id": current_critic.id,
        "name": current_critic.name,
        "image_url": current_critic.image_url,
        "favorite_movies": favorites,
        "user_first_name": current_user.first_name,
        "user_last_name": current_user.last_name,
        "notes": favorite['notes'],
        "user_links": links
    }


@app.route("/update_critic", methods=["POST"])
def update_critic():
    data = {
        "id": request.json["critic_id"],
        "name": request.json["name"],
        "image_url": request.json["image_url"]
    }

    critic.Critic.update(data)
    return redirect("/dashboard")


@app.route("/critics/delete/<int:critic_id>")
def delete_critic(critic_id):
    data = { "id": critic_id }
    critic.Critic.delete(data)
    return redirect("/dashboard")


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


@app.route("/critics/<int:critic_id>/links", methods=["POST"])
def add_critic_link(critic_id):
    data = {
        "user_id": request.json["user_id"],
        "critic_id": critic_id,
        "text": request.json["text"],
        "url": request.json["url"]
    }

    critic.Critic.add_link(data)
    return redirect(f"/critics/{critic_id}")

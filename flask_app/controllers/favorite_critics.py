from flask import redirect, request, session

from flask_app import app
from flask_app.models import critic, favorite_critic


@app.route("/favorite_critics", methods=["POST"])
def add_favorite_critic():
    user_id = session["user"]["id"]

    data = {
        "name": request.json["name"].title(),
        "user_id": user_id,
        "notes": ""
    }

    critic_id = -1
    critic_exists = critic.Critic.find_by_name(data)

    if critic_exists:
        critic_id = critic_exists[0]['id']
    else:
        critic_id = critic.Critic.save(
            {
                "name": data["name"],
                "image_url": ""
            })
    favorite_critic.FavoriteCritic.save(
        {
            "critic_id": critic_id,
            "user_id": user_id,
            "notes": "No notes yet"
        })
    return redirect("/dashboard")


@app.route("/favorite_critics/<int:id>/update", methods=["POST"])
def updateCriticNotes(id):
    data = {
        "notes": request.json["notes"],
        "id": id
    }
    return favorite_critic.FavoriteCritic.update(data)


@app.route("/favorite_critics/remove/<int:critic_id>")
def remove_favorite_critic(critic_id):
    user_id = session["user"]["id"]
    data = {
        "critic_id": critic_id,
        "user_id": user_id
    }
    favorite_critic.FavoriteCritic.remove(data)
    return redirect("/dashboard")

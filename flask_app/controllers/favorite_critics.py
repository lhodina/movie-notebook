from flask import redirect, request

from flask_app import app
from flask_app.models import favorite_critic


@app.route("/favorite_critics", methods=["POST"])
def add_favorite_critic():
    data = {
        "notes": request.form["notes"],
        "critic_id": request.form["critic_id"],
        "user_id": request.form["user_id"]
    }

    favorite_critic.FavoriteCritic.save(data)
    return redirect("/dashboard")


@app.route("/favorite_critics/remove/<int:critic_id>")
def remove_favorite_critic(critic_id):
    # UPDATE USER ID
    data = {
        "critic_id": critic_id,
        "user_id": 1
    }
    favorite_critic.FavoriteCritic.remove(data)
    return redirect("/dashboard")

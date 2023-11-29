from flask import redirect, request

from flask_app import app
from flask_app.models import critic_link

@app.route("/critics/<int:critic_id>/links", methods=["POST"])
def add_critic_link(critic_id):
     # REPLACE HARDCODED user_id
    data = {
        "text": request.json["text"],
        "url": request.json["url"],
        "user_id": 1,
        "critic_id": critic_id
    }

    res = critic_link.CriticLink.save(data)
    return {"id": res}


@app.route("/critic_links/<int:critic_link_id>/delete", methods=["POST"])
def delete_critic_link(critic_link_id):
    data = {
        "id": critic_link_id
    }
    critic_link.CriticLink.delete(data)
    return redirect("/dashboard")

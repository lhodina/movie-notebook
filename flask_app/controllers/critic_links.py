from flask import redirect, request

from flask_app import app
from flask_app.models import critic_link

@app.route("/critics/<int:critic_id>/links", methods=["POST"])
def add_critic_link(critic_id):
     # REPLACE HARDCODED user_id WITH CURRENT USER ID SESSION
    data = {
        "text": request.form["text"],
        "url": request.form["url"],
        "user_id": 1,
        "critic_id": critic_id
    }
    critic_link.CriticLink.save(data)
    return redirect("/dashboard")


@app.route("/critic_links/<int:critic_link_id>/delete")
def delete_critic_link(critic_link_id):
    data = {
        "id": critic_link_id
    }
    critic_link.CriticLink.delete(data)
    return redirect("/dashboard")

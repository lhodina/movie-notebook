from flask import redirect, request

from flask_app import app
from flask_app.models import director_link

@app.route("/directors/<int:director_id>/links", methods=["POST"])
def add_director_link(director_id):
     # REPLACE HARDCODED user_id
    data = {
        "text": request.form["text"],
        "url": request.form["url"],
        "user_id": 1,
        "director_id": director_id
    }
    director_link.DirectorLink.save(data)
    return redirect("/dashboard")


@app.route("/director_links/<int:director_link_id>/delete")
def delete_director_link(director_link_id):
    data = {
        "id": director_link_id
    }
    director_link.DirectorLink.delete(data)
    return redirect("/dashboard")

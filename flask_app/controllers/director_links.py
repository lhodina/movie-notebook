from flask import redirect, request, session

from flask_app import app
from flask_app.models import director_link

@app.route("/directors/<int:director_id>/links", methods=["POST"])
def add_director_link(director_id):
    data = {
        "text": request.json["text"],
        "url": request.json["url"],
        "user_id": session["user"]["id"],
        "director_id": director_id
    }
    res = director_link.DirectorLink.save(data)
    return {"id": res}


@app.route("/director_links/<int:director_link_id>/delete", methods=["POST"])
def delete_director_link(director_link_id):
    data = {
        "id": director_link_id
    }
    director_link.DirectorLink.delete(data)
    return redirect("/dashboard")

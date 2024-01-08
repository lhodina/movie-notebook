from flask import redirect, request, session

from flask_app import app
from flask_app.models import movie_link


@app.route("/movies/<int:movie_id>/links", methods=["POST"])
def add_movie_link(movie_id):
    user_id = session["user"]["id"]
    data = {
        "text": request.json["text"],
        "url": request.json["url"],
        "user_id": user_id,
        "movie_id": movie_id
    }
    res = movie_link.MovieLink.save(data)
    return {"id": res}


@app.route("/movie_links/<int:movie_link_id>/delete", methods=["POST"])
def delete_movie_link(movie_link_id):
    data = {
        "id": movie_link_id
    }
    movie_link.MovieLink.delete(data)
    return redirect("/dashboard")

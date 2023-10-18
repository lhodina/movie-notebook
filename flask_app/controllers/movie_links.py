from flask import redirect, request

from flask_app import app
from flask_app.models import movie_link

# MAKE ALL PATHS CONSISTENT -- MOVIE VS REVIEW
@app.route("/movies/<int:movie_id>/links", methods=["POST"])
def add_movie_link(movie_id):
    # REPLACE HARDCODED user_id
    data = {
        "text": request.json["text"],
        "url": request.json["url"],
        "user_id": 1,
        "movie_id": movie_id
    }
    movie_link.MovieLink.save(data)
    return redirect("/dashboard")


@app.route("/movie_links/<int:movie_link_id>/delete")
def delete_movie_link(movie_link_id):
    data = {
        "id": movie_link_id
    }
    movie_link.MovieLink.delete(data)
    return redirect("/dashboard")

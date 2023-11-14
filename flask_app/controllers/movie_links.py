from flask import redirect, request

from flask_app import app
from flask_app.models import movie_link




@app.route("/movie_links/<int:movie_link_id>/delete")
def delete_movie_link(movie_link_id):
    data = {
        "id": movie_link_id
    }
    movie_link.MovieLink.delete(data)
    return redirect("/dashboard")

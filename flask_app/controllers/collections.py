from flask import redirect, request

from flask_app import app
from flask_app.models import collection

@app.route("/collections", methods=["POST"])
def add_collection():
    data = {
        "name": request.form["name"],
        "user_id": request.form["user_id"]
    }

    collection.Collection.save(data)
    return redirect("/dashboard")


@app.route("/collections/<int:collection_id>")
def get_collection(collection_id):
    data = {
        "id": collection_id
    }
    current_collection = collection.Collection.get_one(data)
    return {
        "name": current_collection.name,
        "user_id": current_collection.user_id,
        "movies": current_collection.movies
    }


@app.route("/update_collection", methods=["POST"])
def update_collection():
    data = {
        "id": request.form["collection_id"],
        "name": request.form["name"],
        "user_id": request.form["user_id"]
    }

    collection.Collection.update(data)
    return redirect("/dashboard")


@app.route("/collections/delete/<int:collection_id>")
def delete_collection(collection_id):
    data = { "id": collection_id }
    collection.Collection.delete(data)
    return redirect("/dashboard")


@app.route("/collections/<int:collection_id>/add_movie", methods=["POST"])
def add_movie_to_collection(collection_id):
    data = {
        "collection_id": collection_id,
        "movie_id": request.form["movie_id"]
    }
    collection.Collection.add_movie(data)
    return redirect("/dashboard")

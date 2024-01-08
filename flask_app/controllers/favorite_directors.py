import requests
from flask import redirect, request, session

from flask_app import app
from flask_app.models import favorite_director, director


@app.route("/favorite_directors", methods=["POST"])
def add_favorite_director():
    user_id = session["user"]["id"]

    data = {
        "name": request.json["name"].title(),
        "user_id": user_id,
        "notes": ""
    }

    if (len(data["name"]) < 2) :
        return {"message": "Name must be at least two characters"}

    director_id = -1
    director_exists = director.Director.find_by_name(data)

    if director_exists:
        director_id = director_exists[0]['id']
    else:
        api_key = "fe2167be80c61b6a35d68b2666a4ae33"
        api_director_results = requests.get(f"https://api.themoviedb.org/3/search/person?api_key={api_key}&query={data['name']}").json()
        print("api_director_results: ", api_director_results)
        if not (len(api_director_results["results"]) > 0):
            print("testing director not found")
            return {
                "message": "Director not found: ",
                "name": data["name"]
                }
        api_director = api_director_results["results"][0]
        image_url_base = "https://image.tmdb.org/t/p/w500"
        api_director_image_url = image_url_base + api_director["profile_path"]
        director_id = director.Director.save(
            {
                "name": data["name"],
                "image_url": api_director_image_url
            })
    favorite_director.FavoriteDirector.save(
        {
            "director_id": director_id,
            "user_id": user_id,
            "notes": ""
        })
    return {"director_id": director_id}


@app.route("/favorite_directors/<int:id>/update", methods=["POST"])
def updateNotes(id):
    data = {
        "notes": request.json["notes"],
        "id": id
    }
    res = favorite_director.FavoriteDirector.update(data)
    return res


@app.route("/favorite_directors/remove/<int:director_id>")
def remove_favorite_director(director_id):
    user_id = session["user"]["id"]
    data = {
        "director_id": director_id,
        "user_id": user_id
    }
    favorite_director.FavoriteDirector.remove(data)
    return redirect("/dashboard")

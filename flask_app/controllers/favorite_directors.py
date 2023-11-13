import requests
from flask import redirect, request

from flask_app import app
from flask_app.models import favorite_director, director


@app.route("/favorite_directors", methods=["POST"])
def add_favorite_director():
    # Replace hardcoded user id
    user_id = 1

    data = {
        "name": request.json["name"].title(),
        "user_id": user_id,
        "notes": ""
    }

    director_id = -1
    director_exists = director.Director.find_by_name(data)

    if director_exists:
        # print("director exists: ", director_exists)
        director_id = director_exists[0]['id']
    else:
        # print("director does not exist")
        api_key = "fe2167be80c61b6a35d68b2666a4ae33"
        api_director_results = requests.get(f"https://api.themoviedb.org/3/search/person?api_key={api_key}&query={data['name']}").json()
        api_director = api_director_results["results"][0]
        # print("api_director: ", api_director)
        image_url_base = "https://image.tmdb.org/t/p/w500"
        api_director_image_url = image_url_base + api_director["profile_path"]
        # print("api_director_image_url: ", api_director_image_url)
        director_id = director.Director.save(
            {
                "name": data["name"],
                "image_url": api_director_image_url
            })
    favorite_director.FavoriteDirector.save(
        {
            "director_id": director_id,
            "user_id": user_id,
            "notes": "No notes yet"
        })
    return redirect("/dashboard")


@app.route("/favorite_directors/<int:id>/update", methods=["POST"])
def updateNotes(id):
    data = {
        "notes": request.json["notes"],
        "id": id
    }
    res = favorite_director.FavoriteDirector.update(data)
    print("res: ", res)
    return res


@app.route("/favorite_directors/remove/<int:director_id>")
def remove_favorite_director(director_id):
    # UPDATE USER ID
    data = {
        "director_id": director_id,
        "user_id": 1
    }
    favorite_director.FavoriteDirector.remove(data)
    return redirect("/dashboard")

import requests
from flask import redirect, request

from flask_app import app
from flask_app.models import review, movie_link, director, movie


@app.route("/reviews", methods=["POST"])
def add_review():
    # REPLACE HARDCODED user_id
    review_data = {
        "rating": request.json['rating'],
        "notes": request.json['notes'],
        "watched": request.json['watched'],
        "user_id": 1
    }

    movie_data = {
        "title": request.json["title"],
        "image_url": ""
    }

    # Search our DB for existing movie by title -- if none, create new movie entry, then create new review entry
    movie_exists = movie.Movie.find_by_title(movie_data)
    movie_id = 0
    if not (movie_exists):
        image_url_base = "https://image.tmdb.org/t/p/w500"
        movie_url_base = "https://api.themoviedb.org/3/search/movie?query="

        movie_title_query = movie_data["title"].lower().replace(" ", "+")
        movie_url = movie_url_base + movie_title_query
        headers = {
            "accept": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZTIxNjdiZTgwYzYxYjZhMzVkNjhiMjY2NmE0YWUzMyIsInN1YiI6IjYzMmRkMzZkNTU5MzdiMDA3YzA5MTZlMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qlMgNrzDMM2eqPUGxDRpWsACr9o-xb94MKMpdta7K7c"
        }
        response = requests.get(movie_url, headers=headers).json()
        # print("API RESPONSE: ", response)
        if len(response["results"]) < 1:
            print("Need to handle error if there's no return data")
            return redirect("/reviews/add")
        poster_path = response["results"][0]["poster_path"]
        movie_poster = image_url_base + poster_path

        api_year = response["results"][0]["release_date"][:4]

        api_movie_id = response["results"][0]["id"]
        # print("api_movie_id: ", api_movie_id)
        api_crew = requests.get(f"https://api.themoviedb.org/3/movie/{api_movie_id}/credits", headers=headers).json()["crew"]
        # print("API CREW: ", api_crew)
        api_director = [x for x in api_crew if x["job"] == "Director"][0]
        # print("api_director:", api_director)
        api_director_name = api_director["name"]
        # print("api_director_name:", api_director_name)
        api_director_image_url = image_url_base + api_director["profile_path"]
        # print("api_director_image_url: ", api_director_image_url)

        # Search our DB for existing director by name -- if none, create new director entry, then go on to movie
        director_exists = director.Director.find_by_name({"name": api_director_name})
        # print("director_exists: ", director_exists)
        directed_by_id = 0
        if (director_exists):
            directed_by_id = director_exists[0]['id']
        else:
            director_data = {
                "name": api_director_name,
                "image_url": api_director_image_url
            }
            directed_by_id = director.Director.save(director_data)
        movie_data["directed_by_id"] = directed_by_id
        movie_data['image_url'] = movie_poster
        movie_data['year'] = api_year
        movie_data['title'] = response["results"][0]["title"]
        movie_id = movie.Movie.save(movie_data)
    else:
        movie_id = movie_exists[0]['id']
    review_data["movie_id"] = movie_id
    review.Review.save(review_data)

    location = request.json["location"]
    if (location == "favoriteMovies"):
        data = {
            "director_id": request.json["director_id"],
            "movie_id": movie_id
        }
        saved_favorite = director.Director.add_favorite(data)
    res = {**review_data, ** movie_data}
    return res


@app.route("/reviews/<int:review_id>")
def get_review(review_id):
    data = {
        "id": review_id
    }

    current_review = review.Review.get_one(data)
    # REPLACE HARDCODED user_id
    link_data = {
        "movie_id": current_review.movie_id,
        "user_id": 1
    }
    movie_links = movie_link.MovieLink.get_all(link_data)

    return {
        "rating": current_review.rating,
        "notes": current_review.notes,
        "watched": current_review.watched,
        "user_id": current_review.user_id,
        "movie_id": current_review.movie_id,
        "title": current_review.movie.title,
        "year": current_review.movie.year,
        "image_url": current_review.movie.image_url,
        "directed_by_id": current_review.movie.directed_by_id,
        "director_name": current_review.movie.director.name,
        "movie_links": movie_links,
        "critic_fans": current_review.critic_fans,
        "director_fans": current_review.director_fans
    }


@app.route("/reviews/<int:id>", methods=["POST"])
def update_review(id):
    # UPDATE HARDCODED USER ID
    data = {
        "id": id,
        "rating": request.json['rating'],
        "notes": request.json["notes"],
        "watched": request.json["watched"],
        "user_id": 1,
        "movie_id": request.json["movieId"]
    }

    review.Review.update(data)
    return redirect("/dashboard")


@app.route("/reviews/delete/<int:review_id>")
def delete_review(review_id):
    data = { "id": review_id }
    review.Review.delete(data)
    return redirect("/dashboard")

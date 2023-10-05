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

    # print("TESTING watched: ", review_data['watched'])

    director_data = {
        "name": request.json["directorName"],
        "image_url": ""
    }

    # # This can eventually come from API
    movie_data = {
        "title": request.json["title"],
        "image_url": request.json["imageUrl"]
    }

    # print("ROUTE:")
    # print("director_data: ", director_data)
    # print("movie_data: ", movie_data)
    # print("review_data: ", review_data)
    # Search our DB for existing director by name -- if none, create new director entry, then go on to movie
    director_exists = director.Director.find_by_name(director_data)
    directed_by_id = 0
    # print("director_exists: ", director_exists)
    if (director_exists):
        # print("DIRECTOR EXISTS")
        directed_by_id = director_exists[0]['id']
    else:
        # print("DIRECTOR DOES NOT EXIST")
        directed_by_id = director.Director.save(director_data)
    # Search our DB for existing movie by title -- if none, create new movie entry, then create new review entry
    movie_exists = movie.Movie.find_by_title(movie_data)
    movie_id = 0
    if not (movie_exists):
        # print("MOVIE DOES NOT EXIST")
        movie_data["directed_by_id"] = directed_by_id

        image_url_base = "https://image.tmdb.org/t/p/w500"
        movie_url_base = "https://api.themoviedb.org/3/search/movie?query="

        movie_title_query = movie_data["title"].lower().replace(" ", "+")
        # print("movie_title_query: ", movie_title_query)
        movie_url = movie_url_base + movie_title_query
        headers = {
            "accept": "application/json",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZTIxNjdiZTgwYzYxYjZhMzVkNjhiMjY2NmE0YWUzMyIsInN1YiI6IjYzMmRkMzZkNTU5MzdiMDA3YzA5MTZlMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qlMgNrzDMM2eqPUGxDRpWsACr9o-xb94MKMpdta7K7c"
        }
        response = requests.get(movie_url, headers=headers).json()

        poster_path = response["results"][0]["poster_path"]
        movie_poster = image_url_base + poster_path
        # print("movie_poster: ", movie_poster)

        api_year = response["results"][0]["release_date"][:4]
        # print("api_year ", api_year)
        movie_data['image_url'] = movie_poster
        movie_data['year'] = api_year
        movie_id = movie.Movie.save(movie_data)
    else:
        # print("MOVIE EXISTS")
        movie_id = movie_exists[0]['id']
    review_data["movie_id"] = movie_id
    review.Review.save(review_data)
    return redirect("/dashboard")


@app.route("/reviews/<int:review_id>")
def get_review(review_id):
    data = {
        "id": review_id
    }

    current_review = review.Review.get_one(data)
    # print(" CONTROLLER current_review.critic_fans: ", current_review.critic_fans)
    # REPLACE HARDCODED user_id
    # MIGHT NEED TO UPDATE HOW YOU GET movie_id
    link_data = {
        "movie_id": current_review.movie_id,
        "user_id": 1
    }
    movie_links = movie_link.MovieLink.get_all(link_data)
    # for item in movie_links:
        # print("ITEM: ", item)

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

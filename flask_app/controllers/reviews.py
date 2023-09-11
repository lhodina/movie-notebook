from flask import redirect, request

from flask_app import app
from flask_app.models import review, movie_link, director, movie


@app.route("/reviews", methods=["POST"])
def add_review():
    # REPLACE HARDCODED user_id WITH CURRENT USER ID IN SESSION
    review_data = {
        "rating": request.json['rating'],
        "notes": request.json['notes'],
        "watched": request.json['watched'],
        "user_id": 1
    }

    if (review_data['watched'] == 'on'):
        review_data['watched'] = 1
    else:
        review_data['watched'] = 0
    print("review_data['watched']", review_data['watched'])

    director_data = {
        "name": request.json["directorName"],
        "image_url": ""
    }

    # # This can eventually come from API
    movie_data = {
        "title": request.json["title"],
        "year": request.json["year"],
        "image_url": request.json["imageUrl"]
    }

    print("ROUTE:")
    print("director_data: ", director_data)
    print("movie_data: ", movie_data)
    print("review_data: ", review_data)
    # Search our DB fro existing director by name -- if none, create new director entry, then go on to movie
    director_exists = director.Director.find_by_name(director_data)
    directed_by_id = 0
    print("director_exists: ", director_exists)
    if (director_exists):
        print("DIRECTOR EXISTS")
        directed_by_id = director_exists[0]['id']
    else:
        print("DIRECTOR DOES NOT EXIST")
        directed_by_id = director.Director.save(director_data)
    # Search our DB for existing movie by title -- if none, create new movie entry, then create new review entry
    movie_exists = movie.Movie.find_by_title(movie_data)
    movie_id = 0
    if not (movie_exists):
        print("MOVIE DOES NOT EXIST")
        movie_data["directed_by_id"] = directed_by_id
        movie_id = movie.Movie.save(movie_data)
    else:
        print("MOVIE EXISTS")
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
    # REPLACE HARDCODED user_id WITH CURRENT USER ID IN SESSION
    # MIGHT NEED TO UPDATE HOW YOU GET movie_id
    link_data = {
        "movie_id": current_review.movie_id,
        "user_id": 1
    }
    movie_links = movie_link.MovieLink.get_all(link_data)
    for item in movie_links:
        print("ITEM: ", item)

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
        "movie_links": movie_links
    }


@app.route("/update_review", methods=["POST"])
def update_review():
    data = {
        "id": request.form["review_id"],
        "rating": request.form["rating"],
        "notes": request.form["notes"],
        "watched": request.form["watched"],
        "user_id": request.form["user_id"],
        "movie_id": request.form["movie_id"]
    }

    review.Review.update(data)
    return redirect("/dashboard")


@app.route("/reviews/delete/<int:review_id>")
def delete_review(review_id):
    data = { "id": review_id }
    review.Review.delete(data)
    return redirect("/dashboard")

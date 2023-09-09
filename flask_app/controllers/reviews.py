from flask import redirect, request

from flask_app import app
from flask_app.models import review, movie_link


@app.route("/reviews", methods=["POST"])
def add_review():
    data = {
        "rating": request.form["rating"],
        "notes": request.form["notes"],
        "watched": request.form["watched"],
        "user_id": request.form["user_id"],
        "movie_id": request.form["movie_id"]
    }

    review.Review.save(data)
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

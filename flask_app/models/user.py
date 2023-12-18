from flask_app import app
from flask_app.config.mysqlconnection import connectToMySQL
from flask import flash
from flask_bcrypt import Bcrypt
from flask_app.models import review
import re


bcrypt = Bcrypt(app)

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')
PASSWORD_REGEX = re.compile(r'^(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\-\#\$\.\%\&\*\@\!]{8,}$')

class User:
    DB = "movie_notebook"
    def __init__(self, data):
        self.id = data['id']
        self.first_name = data['first_name']
        self.last_name = data['last_name']
        self.email = data['email']
        self.password = data['password']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.collections = []


    @classmethod
    def save(cls, data):
        query = """
        INSERT INTO users (first_name, last_name, email, password)
        VALUES ( %(first_name)s, %(last_name)s, %(email)s, %(password)s )
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def get_all(cls):
        query = "SELECT * FROM users;"
        users = connectToMySQL(cls.DB).query_db(query)
        all_users = []
        for user in users:
            all_users.append(cls(user))
        return all_users


    @classmethod
    def get_one(cls, data):
        query = """
        SELECT * FROM users
        LEFT JOIN collections ON collections.user_id = users.id
        WHERE users.id = %(id)s;
        """
        result = connectToMySQL(cls.DB).query_db(query, data)
        current_user_data = {
            "id": result[0]["id"],
            "first_name": result[0]["first_name"],
            "last_name": result[0]["last_name"],
            "email": result[0]["email"],
            "password": result[0]["password"],
            "created_at": result[0]["created_at"],
            "updated_at": result[0]["updated_at"],
        }

        current_user = cls(current_user_data)

        # for item in result:
        #     current_collection = {
        #         "id": item["collections.id"],
        #         "name": item["name"],
        #     }
        #     current_user.collections.append(current_collection)
        return current_user


    @classmethod
    def get_favorite_directors(cls, data):
        query = """
        SELECT * FROM directors
        JOIN user_favorite_directors ON user_favorite_directors.director_id = directors.id
        WHERE user_favorite_directors.user_id = %(id)s;
        """
        result = connectToMySQL(cls.DB).query_db(query, data)
        favs = []
        for item in result:
            fav = {
                "id": item["id"],
                "name": item["name"],
                "image_url": item["image_url"],
                "notes": item["notes"]
            }
            favs.append(fav)
        return favs


    @classmethod
    def get_favorite_critics(cls, data):
        query = """
        SELECT * FROM critics
        JOIN user_favorite_critics ON user_favorite_critics.critic_id = critics.id
        WHERE user_favorite_critics.user_id = %(id)s;
        """
        result = connectToMySQL(cls.DB).query_db(query, data)
        favs = []
        for item in result:
            fav = {
                "id": item["id"],
                "name": item["name"],
                "image_url": item["image_url"],
                "notes": item["notes"]
            }
            favs.append(fav)
        return favs


    @classmethod
    def get_reviews(cls, data):
        query = """
        SELECT * FROM movies
        JOIN reviews ON reviews.movie_id = movies.id
        JOIN directors ON directors.id = movies.directed_by_id
        WHERE reviews.user_id = %(id)s;
        """
        result = connectToMySQL(cls.DB).query_db(query, data)
        reviews = []
        for item in result:
            review_data = {
                "id": item["reviews.id"],
                "movie_id": item["id"],
                "user_id": item["user_id"],
                "watched": item["watched"],
                "rating": item["rating"],
                "notes": item["notes"],
                "created_at": item["reviews.created_at"],
                "updated_at": item["reviews.updated_at"]
            }

            current_review = review.Review(review_data)
            # current_review.critic_fans = current_review.get_critic_fans({ "id": current_review.movie_id })
            # current_review.director_fans = current_review.get_director_fans({ "id": current_review.movie_id })

            movie_data = {
                "title": item["title"],
                "image_url": item["image_url"],
                "year": item["year"],
                "directed_by_id": item["directed_by_id"],
                "director_name": item["name"]
            }

            # likes_count = len(current_review.critic_fans) + len(current_review.director_fans)

            full_review = {
                "id": current_review.id,
                "movie_id": current_review.movie_id,
                "user_id": current_review.user_id,
                "watched": current_review.watched,
                "rating": current_review.rating,
                "notes": current_review.notes,
                "critic_fans": [],
                "director_fans": [],
                **movie_data,
                # "likes_count": likes_count
                "likes_count": 0
            }

            reviews.append(full_review)
        reviews.sort(key=lambda x: x['likes_count'], reverse=True)
        return reviews


    @classmethod
    def get_by_email(cls, user_email):
        query = "SELECT * FROM users WHERE email = %(email)s;"
        return connectToMySQL(cls.DB).query_db(query, user_email)


    @staticmethod
    def validate_user(user):
        messages = []
        if not user["first_name"]:
            messages.append("First name required")
        elif len(user["first_name"]) < 2:
            messages.append("First name must be at least two characters")
        if not user["last_name"]:
            messages.append("Last name required")
        elif len(user["last_name"]) < 2:
            messages.append("Last name must be at least two characters")
        if not user["email"]:
            messages.append("Email required")
        elif not EMAIL_REGEX.match(user["email"]):
            messages.append("Email must be in the following format: beeblebrox@galaxy.gov")
        query = "SELECT * FROM users WHERE email = %(email)s;"
        data = {"email": user["email"]}
        res = connectToMySQL("movie_notebook").query_db(query, data)
        if res:
            messages.append("Email already in use")
        if not user["password"]:
            messages.append("Password required")
        elif user["password"] != user["confirm_password"]:
            messages.append("Passwords do not match")
        elif not PASSWORD_REGEX.match(user["password"]):
            messages.append("Password must include 1 capital letter and 1 number")
        return messages


    @staticmethod
    def validate_login(data):
        messages = []
        if not data["email"]:
            messages.append("Email Required")
        elif not EMAIL_REGEX.match(data["email"]):
            messages.append("Email must be in the following format: beeblebrox@galaxy.gov")
        else:
            query = "SELECT * FROM users WHERE email = %(email)s;"
            result = connectToMySQL("movie_notebook").query_db(query, {"email": data["email"]})
            current_user = None
            if not result:
                messages.append("Email not found")
            else:
                current_user = result[0]
            if current_user and not bcrypt.check_password_hash(current_user["password"], data["password"]):
                messages.append("Incorrect password")
        if not data["password"]:
            messages.append("Password required")
        return messages

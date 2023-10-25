from flask_app.config.mysqlconnection import connectToMySQL
from flask_app.models import movie, director

class Review:
    DB = "movie_notebook"
    def __init__(self, data):
        self.id = data['id']
        self.rating = data['rating']
        self.notes = data['notes']
        self.watched = data['watched']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.user_id = data['user_id']
        self.movie_id = data['movie_id']
        self.movie = None
        self.critic_fans = []
        self.director_fans = []

    @classmethod
    def save(cls, data):
        query = """
        INSERT INTO reviews (rating, notes, watched, user_id, movie_id)
        VALUES ( %(rating)s, %(notes)s, %(watched)s, %(user_id)s,  %(movie_id)s)
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def get_one(cls, data):
        query = """
        SELECT * FROM reviews
        JOIN movies ON movies.id = reviews.movie_id
        JOIN directors ON directors.id = movies.directed_by_id
        WHERE reviews.id = %(id)s;
        """
        result = connectToMySQL(cls.DB).query_db(query, data)[0]

        current_review_data = {
            "id": result["id"],
            "rating": result["rating"],
            "notes": result["notes"],
            "watched": result["watched"],
            "created_at": result["created_at"],
            "updated_at": result["updated_at"],
            "user_id": result["user_id"],
            "movie_id": result["movie_id"]
        }

        current_review = cls(current_review_data)
        current_review.critic_fans = current_review.get_critic_fans({"id": current_review.movie_id})
        current_review.director_fans = current_review.get_director_fans({"id": current_review.movie_id})

        movie_data = {
            "id": result["movie_id"],
            "title": result["title"],
            "image_url": result["image_url"],
            "year": result["year"],
            "directed_by_id": result["directed_by_id"],
            "created_at": result["movies.created_at"],
            "updated_at": result["movies.updated_at"]
        }

        current_movie = movie.Movie(movie_data)

        current_director_data = {
            "id": result["directors.id"],
            "name": result["name"],
            "image_url": result["directors.image_url"],
            "created_at": result["directors.created_at"],
            "updated_at": result["directors.updated_at"]
        }

        current_movie.director = director.Director(current_director_data)

        current_review.movie = current_movie

        return current_review

    @classmethod
    def get_by_movie_id(cls, data):
        query = """
        SELECT * FROM reviews
        WHERE movie_id = %(movie_id)s AND user_id = %(user_id)s;
        """
        return connectToMySQL(cls.DB).query_db(query, data)

    @classmethod
    def update(cls, data):
        query = """
        UPDATE reviews
        SET
        rating=%(rating)s,
        notes=%(notes)s,
        watched=%(watched)s,
        user_id=%(user_id)s,
        movie_id=%(movie_id)s
        WHERE id = %(id)s;
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def delete(cls, data):
        query = "DELETE FROM reviews WHERE id = %(id)s;"
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def get_critic_fans(cls, data):
        query = """
        SELECT * FROM critics
        JOIN critic_favorite_movies ON critic_favorite_movies.critic_id = critics.id
        JOIN user_favorite_critics ON user_favorite_critics.critic_id = critics.id
        WHERE critic_favorite_movies.movie_id = %(id)s AND user_favorite_critics.user_id = 1;
        """
        result = connectToMySQL(cls.DB).query_db(query, data)
        return result

    @classmethod
    def get_director_fans(cls, data):
        query = """
        SELECT * FROM directors
        JOIN director_favorite_movies ON director_favorite_movies.director_id = directors.id
        JOIN user_favorite_directors ON user_favorite_directors.director_id = directors.id
        WHERE director_favorite_movies.movie_id = %(id)s AND user_favorite_directors.user_id = 1;
        """
        result = connectToMySQL(cls.DB).query_db(query, data)
        return result

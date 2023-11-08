from flask_app.config.mysqlconnection import connectToMySQL
from flask_app.models import director

class Movie:
    DB = "movie_notebook"
    def __init__(self, data):
        self.id = data['id']
        self.title = data['title']
        self.year = data['year']
        self.image_url = data['image_url']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.directed_by_id = data['directed_by_id']
        self.director = None

    @classmethod
    def save(cls, data):
        query = """
        INSERT INTO movies (title, year, image_url, directed_by_id)
        VALUES ( %(title)s, %(year)s, %(image_url)s, %(directed_by_id)s )
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def get_all_movies(cls):
        all_movies = []
        query = """
        SELECT * FROM movies;
        """
        results = connectToMySQL(cls.DB).query_db(query)
        for result in results:
            all_movies.append(result)
        return all_movies


    @classmethod
    def get_one(cls, data):
        query = """
        SELECT * FROM movies
        JOIN directors ON directors.id = movies.directed_by_id
        WHERE movies.id = %(id)s;
        """
        result = connectToMySQL(cls.DB).query_db(query, data)[0]

        current_movie_data = {
            "id": result["id"],
            "title": result["title"],
            "year": result["year"],
            "image_url": result["image_url"],
            "created_at": result["created_at"],
            "updated_at": result["updated_at"],
            "directed_by_id": result["directed_by_id"]
        }

        current_movie = cls(current_movie_data)

        current_director_data = {
            "id": result["directors.id"],
            "name": result["name"],
            "image_url": result["directors.image_url"],
            "created_at": result["directors.created_at"],
            "updated_at": result["directors.updated_at"],
        }
        current_director = director.Director(current_director_data)
        current_movie.director = current_director

        return current_movie


    @classmethod
    def find_by_title(cls, data):
        query = """
        SELECT * FROM movies
        WHERE movies.title = %(title)s;
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def update(cls, data):
        query = """
        UPDATE movies
        SET
        title=%(title)s,
        year=%(year)s,
        image_url=%(image_url)s,
        directed_by_id=%(directed_by_id)s
        WHERE id = %(id)s;
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def delete(cls, data):
        query = "DELETE FROM movies WHERE id = %(id)s;"
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def add_director_fan(cls, data):
        query = """
        INSERT INTO director_favorite_movies(director_id, movie_id)
        VALUES(%(director_id)s, %(movie_id)s);
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def add_critic_fan(cls, data):
        query = """
        INSERT INTO critic_favorite_movies(critic_id, movie_id)
        VALUES(%(critic_id)s, %(movie_id)s);
        """
        return connectToMySQL(cls.DB).query_db(query, data)

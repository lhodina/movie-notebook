from flask_app.config.mysqlconnection import connectToMySQL

class Collection:
    DB = "movie_notebook"
    def __init__(self, data):
        self.id = data['id']
        self.name = data['name']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.user_id = data['user_id']
        self.movies = []


    @classmethod
    def save(cls, data):
        query = """
        INSERT INTO collections (name, user_id)
        VALUES ( %(name)s, %(user_id)s )
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def get_one(cls, data):
        query = """
        SELECT * FROM collections
        LEFT JOIN movie_collections ON movie_collections.collection_id = collections.id
        LEFT JOIN movies ON movies.id = movie_collections.movie_id
        LEFT JOIN directors ON directors.id = movies.directed_by_id
        WHERE collections.id = %(id)s;
        """
        result = connectToMySQL(cls.DB).query_db(query, data)
        current_collection_data = {
            "id": result[0]["id"],
            "name": result[0]["name"],
            "created_at": result[0]["created_at"],
            "updated_at": result[0]["updated_at"],
            "user_id": result[0]["user_id"]
        }

        current_collection = cls(current_collection_data)

        for item in result:
            current_movie = {
                "id": item["movies.id"],
                "title": item["title"],
                "image_url": item["image_url"],
                "year": item["year"],
                "directed_by_id": item["directed_by_id"],
                "director_name": item["directors.name"]
            }
            current_collection.movies.append(current_movie)

        return current_collection


    @classmethod
    def update(cls, data):
        query = """
        UPDATE collections
        SET
        name=%(name)s,
        user_id=%(user_id)s
        WHERE id = %(id)s;
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def delete(cls, data):
        query = "DELETE FROM collections WHERE id = %(id)s;"
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def add_movie(cls, data):
        query = """
        INSERT INTO movie_collections (movie_id, collection_id)
        VALUES(%(movie_id)s, %(collection_id)s)
        """
        return connectToMySQL(cls.DB).query_db(query, data)

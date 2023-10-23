from flask_app.config.mysqlconnection import connectToMySQL

class Director:
    DB = "movie_notebook"
    def __init__(self, data):
        self.id = data['id']
        self.name = data['name']
        self.image_url = data['image_url']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.movies_directed = []


    @classmethod
    def save(cls, data):
        query = """
        INSERT INTO directors (name, image_url)
        VALUES ( %(name)s, %(image_url)s );
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def get_all_directors(cls):
        all_directors = []
        query = """
        SELECT * FROM directors;
        """
        results = connectToMySQL(cls.DB).query_db(query)
        for result in results:
            all_directors.append(result)
        return all_directors


    @classmethod
    def get_one(cls, data):
        query = """
        SELECT * FROM directors
        LEFT JOIN movies ON movies.directed_by_id = directors.id
        WHERE directors.id = %(id)s;
        """
        result = connectToMySQL(cls.DB).query_db(query, data)

        current_director_data = {
            "id": result[0]["id"],
            "name": result[0]["name"],
            "image_url": result[0]["image_url"],
            "created_at": result[0]["created_at"],
            "updated_at": result[0]["updated_at"]
        }
        current_director = cls(current_director_data)

        for item in result:
            current_movie_data = {
                "id": item["movies.id"],
                "title": item["title"],
                "year": item["year"],
                "image_url": item["movies.image_url"]
            }
            current_director.movies_directed.append(current_movie_data)
        return current_director


    @classmethod
    def find_by_name(cls, data):
        query = """
        SELECT * FROM directors
        WHERE directors.name = %(name)s;
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def get_favorites(cls, data):
        query = """
        SELECT * FROM movies
        JOIN director_favorite_movies ON director_favorite_movies.movie_id = movies.id
        JOIN directors ON directors.id = movies.directed_by_id
        WHERE director_favorite_movies.director_id = %(id)s;
        """
        result = connectToMySQL(cls.DB).query_db(query, data)
        favs = []
        for item in result:
            fav = {
                "id": item["id"],
                "title": item["title"],
                "image_url": item["image_url"],
                "year": item["year"],
                "directed_by_id": item["directed_by_id"],
                "director_name": item["name"]
            }
            favs.append(fav)

        return favs


    @classmethod
    def update(cls, data):
        query = """
        UPDATE directors
        SET
        name=%(name)s,
        image_url=%(image_url)s
        WHERE id = %(id)s;
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def delete(cls, data):
        query = "DELETE FROM directors WHERE id = %(id)s;"
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def add_favorite(cls, data):
        query = """
        INSERT INTO director_favorite_movies(director_id, movie_id)
        VALUES(%(director_id)s, %(movie_id)s);
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def remove_favorite(cls, data):
        query = """
        DELETE FROM director_favorite_movies
        WHERE movie_id = %(movie_id)s AND director_id = %(director_id)s;
        """
        return connectToMySQL(cls.DB).query_db(query, data)

    @classmethod
    def get_links(cls, data):
        query = """
        SELECT * FROM director_links WHERE director_id = %(id)s;
        """
        return connectToMySQL(cls.DB).query_db(query, data)

    @classmethod
    def add_link(cls, data):
        query = """
        INSERT INTO director_links(user_id, director_id, text, url)
        VALUES(%(user_id)s, %(director_id)s, %(text)s, %(url)s);
        """
        return connectToMySQL(cls.DB).query_db(query, data)

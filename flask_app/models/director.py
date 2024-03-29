from flask_app.config.mysqlconnection import connectToMySQL

class Director:
    DB = "movie_notebook"
    def __init__(self, data):
        self.id = data["id"]
        self.name = data["name"]
        self.image_url = data["image_url"]
        self.created_at = data["created_at"]
        self.updated_at = data["updated_at"]
        self.movies_directed = []


    @classmethod
    def save(cls, data):
        query = """
        INSERT INTO directors (name, image_url)
        VALUES ( %(name)s, %(image_url)s );
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def get_one(cls, data):
        # Old working query (doesn't filter for user favorites):
        # query = """
        # SELECT * FROM directors
        # LEFT JOIN movies ON movies.directed_by_id = directors.id
        # LEFT JOIN reviews ON reviews.movie_id = movies.id
        # LEFT JOIN director_favorite_movies ON director_favorite_movies.movie_id = movies.id
        # LEFT JOIN directors AS director_fans ON director_fans.id = director_favorite_movies.director_id
        # LEFT JOIN critic_favorite_movies ON critic_favorite_movies.movie_id = movies.id
        # LEFT JOIN critics ON critics.id = critic_favorite_movies.critic_id
        # WHERE directors.id = %(id)s;
        # """

        query = """
        SELECT * FROM directors
        LEFT JOIN movies ON movies.directed_by_id = directors.id
        LEFT JOIN reviews ON reviews.movie_id = movies.id
        LEFT JOIN user_favorite_directors ON user_favorite_directors.user_id = %(user_id)s
        LEFT JOIN director_favorite_movies ON director_favorite_movies.movie_id = movies.id AND director_favorite_movies.director_id = user_favorite_directors.director_id
        LEFT JOIN directors AS director_fans ON director_fans.id = director_favorite_movies.director_id
        LEFT JOIN user_favorite_critics ON user_favorite_critics.user_id = %(user_id)s
        LEFT JOIN critic_favorite_movies ON critic_favorite_movies.movie_id = movies.id AND critic_favorite_movies.critic_id = user_favorite_critics.critic_id
        LEFT JOIN critics ON critics.id = critic_favorite_movies.critic_id
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

        titles = []
        for movie in result:
            if movie["title"] not in titles:
                titles.append(movie["title"])
                current_movie_data = {
                    "id": movie["movies.id"],
                    "title": movie["title"],
                    "image_url": movie["movies.image_url"],
                    "review_id": movie["reviews.id"],
                    "director_fans": [],
                    "critic_fans": []
                }
                current_director.movies_directed.append(current_movie_data)

        for movie in current_director.movies_directed:
            director_fan_names = []
            critic_fan_names = []
            for record in result:
                if movie["id"] == record["movies.id"]:
                    if record["director_fans.name"] and record["director_fans.name"] not in director_fan_names:
                        director_fan_names.append(record["director_fans.name"])
                        director_fan = {
                            "id": record["director_id"],
                            "name": record["director_fans.name"]
                        }
                        movie["director_fans"].append(director_fan)
                    if record["critics.name"] and record["critics.name"] not in critic_fan_names:
                        critic_fan_names.append(record["critics.name"])
                        critic_fan = {
                            "id": record["critic_id"],
                            "name": record["critics.name"]
                        }
                        movie["critic_fans"].append(critic_fan)
        return current_director


    @classmethod
    def find_by_name(cls, data):
        query = """
        SELECT * FROM directors
        WHERE name = %(name)s;
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def get_favorites(cls, data):
        # Old working query:
        # query = """
        # SELECT * FROM movies
        # JOIN reviews ON reviews.movie_id = movies.id
        # JOIN director_favorite_movies ON director_favorite_movies.movie_id = movies.id
        # LEFT JOIN director_favorite_movies AS other_director_fans ON other_director_fans.movie_id = movies.id
        # LEFT JOIN directors AS director_fans ON director_fans.id = other_director_fans.director_id
        # LEFT JOIN critic_favorite_movies ON critic_favorite_movies.movie_id = movies.id
        # LEFT JOIN critics ON critics.id = critic_favorite_movies.critic_id
        # WHERE director_favorite_movies.director_id = %(id)s;
        # """

        query = """
        SELECT * FROM movies
        JOIN reviews ON reviews.movie_id = movies.id
        JOIN director_favorite_movies ON director_favorite_movies.movie_id = movies.id
        LEFT JOIN user_favorite_directors ON user_favorite_directors.user_id = %(user_id)s
        LEFT JOIN director_favorite_movies AS other_director_fans ON other_director_fans.movie_id = movies.id AND other_director_fans.director_id = user_favorite_directors.director_id
        LEFT JOIN directors AS director_fans ON director_fans.id = other_director_fans.director_id
        LEFT JOIN user_favorite_critics ON user_favorite_critics.user_id = %(user_id)s
        LEFT JOIN critic_favorite_movies ON critic_favorite_movies.movie_id = movies.id AND critic_favorite_movies.critic_id = user_favorite_critics.critic_id
        LEFT JOIN critics ON critics.id = critic_favorite_movies.critic_id
        WHERE director_favorite_movies.director_id = %(id)s;
        """
        result = connectToMySQL(cls.DB).query_db(query, data)
        favs = []
        titles = []
        for movie in result:
            if movie["title"] not in titles:
                titles.append(movie["title"])
                fav = {
                    "id": movie["id"],
                    "title": movie["title"],
                    "image_url": movie["image_url"],
                    "year": movie["year"],
                    "directed_by_id": movie["directed_by_id"],
                    "director_name": movie["name"],
                    "review_id": movie["reviews.id"],
                    "director_fans": [],
                    "critic_fans": []
                }
                favs.append(fav)
        for movie in favs:
            director_fan_names = []
            critic_fan_names = []
            for record in result:
                if movie["id"] == record["id"]:
                    if record["name"] and record["name"] not in director_fan_names:
                        director_fan_names.append(record["name"])
                        director_fan = {
                            "id": record["director_fans.id"],
                            "name": record["name"]
                        }
                        movie["director_fans"].append(director_fan)
                    if record["critics.name"] and record["critics.name"] not in critic_fan_names:
                        critic_fan_names.append(record["critics.name"])
                        critic_fan = {
                            "id": record["critic_id"],
                            "name": record["critics.name"]
                        }
                        movie["critic_fans"].append(critic_fan)
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

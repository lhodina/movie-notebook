from flask_app.config.mysqlconnection import connectToMySQL

class Critic:
    DB = "movie_notebook"
    def __init__(self, data):
        self.id = data['id']
        self.name = data['name']
        self.image_url = data['image_url']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.favorite_movies = []


    @classmethod
    def save(cls, data):
        query = """
        INSERT INTO critics (name, image_url)
        VALUES ( %(name)s, %(image_url)s )
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def get_all_critics(cls):
        all_critics = []
        query = """
        SELECT * FROM critics;
        """
        results = connectToMySQL(cls.DB).query_db(query)
        for result in results:
            all_critics.append(result)
        return all_critics


    @classmethod
    def get_one(cls, data):
        query = """
        SELECT * FROM critics
        LEFT JOIN critic_favorite_movies ON critic_favorite_movies.critic_id = critics.id
        LEFT JOIN movies ON movies.id = critic_favorite_movies.movie_id
        LEFT JOIN directors ON directors.id = movies.directed_by_id
        WHERE critics.id = %(critic_id)s;
        """
        result = connectToMySQL(cls.DB).query_db(query, data)
        current_critic_data = {
            "id": result[0]["id"],
            "name": result[0]["name"],
            "image_url": result[0]["image_url"],
            "created_at": result[0]["created_at"],
            "updated_at": result[0]["updated_at"]
        }

        current_critic = cls(current_critic_data)

        for item in result:
            favorite_movie = {
                "id": item["movies.id"],
                "title": item["title"],
                "year": item["year"],
                "image_url": item["movies.image_url"],
                "directed_by_id": item["directed_by_id"],
                "director_name": item["directors.name"]
            }
            current_critic.favorite_movies.append(favorite_movie)

        return current_critic


    @classmethod
    def find_by_name(cls, data):
        query = """
        SELECT * FROM critics
        WHERE name = %(name)s;
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def update(cls, data):
        query = """
        UPDATE critics
        SET
        name=%(name)s,
        image_url=%(image_url)s
        WHERE id = %(id)s;
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def delete(cls, data):
        query = "DELETE FROM critics WHERE id = %(id)s;"
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def add_favorite(cls, data):
        query = """
        INSERT INTO critic_favorite_movies(critic_id, movie_id)
        VALUES(%(critic_id)s, %(movie_id)s);
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def get_favorites(cls, data):
        query = """
        SELECT * FROM movies
        JOIN critic_favorite_movies ON critic_favorite_movies.movie_id = movies.id
        JOIN directors ON directors.id = movies.directed_by_id
        WHERE critic_favorite_movies.critic_id = %(critic_id)s;
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
    def remove_favorite(cls, data):
        query = """
        DELETE FROM critic_favorite_movies
        WHERE movie_id = %(movie_id)s AND critic_id = %(critic_id)s;
        """
        return connectToMySQL(cls.DB).query_db(query, data)

    @classmethod
    def get_links(cls, data):
        query = """
        SELECT * FROM critic_links WHERE critic_id = %(id)s;
        """
        return connectToMySQL(cls.DB).query_db(query, data)

    @classmethod
    def add_link(cls, data):
        query = """
        INSERT INTO critic_links(user_id, critic_id, text, url)
        VALUES(%(user_id)s, %(critic_id)s, %(text)s, %(url)s);
        """
        return connectToMySQL(cls.DB).query_db(query, data)

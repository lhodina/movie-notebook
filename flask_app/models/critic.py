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
    def get_one(cls, data):
        # Old query:
        # query = """
        # SELECT * FROM critics
        # LEFT JOIN critic_favorite_movies ON critic_favorite_movies.critic_id = critics.id
        # LEFT JOIN movies ON movies.id = critic_favorite_movies.movie_id
        # LEFT JOIN reviews ON reviews.movie_id = movies.id
        # LEFT JOIN director_favorite_movies ON director_favorite_movies.movie_id = movies.id
        # LEFT JOIN directors AS director_fans ON director_fans.id = director_favorite_movies.director_id
        # LEFT JOIN critic_favorite_movies AS join_other_critic_fans ON join_other_critic_fans.movie_id = movies.id
        # LEFT JOIN critics AS other_critic_fans ON other_critic_fans.id = join_other_critic_fans.critic_id
        # WHERE critics.id = %(critic_id)s;
        # """

        query = """
        SELECT * FROM critics
        LEFT JOIN critic_favorite_movies ON critic_favorite_movies.critic_id = critics.id
        LEFT JOIN movies ON movies.id = critic_favorite_movies.movie_id
        LEFT JOIN reviews ON reviews.movie_id = movies.id
        LEFT JOIN user_favorite_directors ON user_favorite_directors.user_id = %(user_id)s
        LEFT JOIN director_favorite_movies ON director_favorite_movies.movie_id = movies.id AND director_favorite_movies.director_id = user_favorite_directors.director_id
        LEFT JOIN directors AS director_fans ON director_fans.id = director_favorite_movies.director_id
        LEFT JOIN user_favorite_critics ON user_favorite_critics.user_id = %(user_id)s
        LEFT JOIN critic_favorite_movies AS join_other_critic_fans ON join_other_critic_fans.movie_id = movies.id AND join_other_critic_fans.critic_id = user_favorite_critics.critic_id
        LEFT JOIN critics AS other_critic_fans ON other_critic_fans.id = join_other_critic_fans.critic_id
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
        titles = []

        for movie in result:
            if movie['title'] and movie['title'] not in titles:
                titles.append(movie['title'])
                fav = {
                    "id": movie["movies.id"],
                    "title": movie["title"],
                    "image_url": movie["movies.image_url"],
                    "review_id": movie["reviews.id"],
                    "director_fans": [],
                    "critic_fans": []
                }
                current_critic.favorite_movies.append(fav)
        for movie in current_critic.favorite_movies:
            director_fan_names = []
            critic_fan_names = []
            for record in result:
                if movie['id'] == record['movies.id']:
                    if record['director_fans.name'] and record['director_fans.name'] not in director_fan_names:
                        director_fan_names.append(record['director_fans.name'])
                        director_fan = {
                            "id": record['director_fans.id'],
                            "name": record['director_fans.name']
                        }
                        movie['director_fans'].append(director_fan)
                    if record['other_critic_fans.name'] and record['other_critic_fans.name'] not in critic_fan_names:
                        critic_fan_names.append(record['other_critic_fans.name'])
                        critic_fan = {
                            "id": record['other_critic_fans.id'],
                            "name": record['other_critic_fans.name']
                        }
                        movie['critic_fans'].append(critic_fan)
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
        LEFT JOIN director_favorite_movies  ON director_favorite_movies.movie_id = movies.id
        LEFT JOIN directors AS director_fans ON director_fans.id = director_favorite_movies.director_id
        LEFT JOIN critic_favorite_movies AS other_critic_fans ON other_critic_fans.movie_id = movies.id
        LEFT JOIN critics ON critics.id = other_critic_fans.critic_id
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
        SELECT * FROM critic_links WHERE critic_id = %(critic_id)s;
        """
        return connectToMySQL(cls.DB).query_db(query, data)

    @classmethod
    def add_link(cls, data):
        query = """
        INSERT INTO critic_links(user_id, critic_id, text, url)
        VALUES(%(user_id)s, %(critic_id)s, %(text)s, %(url)s);
        """
        return connectToMySQL(cls.DB).query_db(query, data)

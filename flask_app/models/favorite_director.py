from flask_app.config.mysqlconnection import connectToMySQL

class FavoriteDirector:
    DB = "movie_notebook"
    def __init__(self, data):
        self.id = data['id']
        self.notes = data['name']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.director_id = data['director_id']
        self.user_id = data['user_id']


    @classmethod
    def save(cls, data):
        query = """
        INSERT INTO user_favorite_directors (notes, user_id, director_id)
        VALUES ( %(notes)s, %(user_id)s, %(director_id)s)
        """
        return connectToMySQL(cls.DB).query_db(query, data)

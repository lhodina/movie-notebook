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
        VALUES ( %(notes)s, %(user_id)s, %(director_id)s);
        """
        return connectToMySQL(cls.DB).query_db(query, data)

    @classmethod
    def get_one(cls, data):
        query = """
        SELECT * FROM user_favorite_directors WHERE director_id = %(id)s;
        """
        return connectToMySQL(cls.DB).query_db(query, data)

    @classmethod
    def update(cls, data):
        query = """
        UPDATE user_favorite_directors
        SET notes = %(notes)s
        WHERE director_id = %(id)s
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def remove(cls, data):
        query = """
        DELETE FROM user_favorite_directors
        WHERE user_id = %(user_id)s AND director_id = %(director_id)s;
        """
        return connectToMySQL(cls.DB).query_db(query, data)

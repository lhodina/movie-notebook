from flask_app.config.mysqlconnection import connectToMySQL

class FavoriteCritic:
    DB = "movie_notebook"
    def __init__(self, data):
        self.id = data['id']
        self.notes = data['name']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.critic_id = data['critic_id']
        self.user_id = data['user_id']


    @classmethod
    def save(cls, data):
        query = """
        INSERT INTO user_favorite_critics (notes, user_id, critic_id)
        VALUES ( %(notes)s, %(user_id)s, %(critic_id)s);
        """
        return connectToMySQL(cls.DB).query_db(query, data)

    @classmethod
    def get_one(cls, data):
        query = """
        SELECT * FROM user_favorite_critics WHERE critic_id = %(critic_id)s AND user_id = %(user_id)s;
        """
        return connectToMySQL(cls.DB).query_db(query, data)

    @classmethod
    def update(cls, data):
        query = """
        UPDATE user_favorite_critics
        SET notes = %(notes)s
        WHERE critic_id = %(id)s
        """
        return connectToMySQL(cls.DB).query_db(query, data)

    @classmethod
    def remove(cls, data):
        query = """
        DELETE FROM user_favorite_critics
        WHERE user_id = %(user_id)s AND critic_id = %(critic_id)s;
        """
        return connectToMySQL(cls.DB).query_db(query, data)

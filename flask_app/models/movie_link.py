from flask_app.config.mysqlconnection import connectToMySQL

class MovieLink:
    DB = "movie_notebook"
    def __init__(self, data):
        self.id = data['id']
        self.text = data['text']
        self.url = data['url']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.user_id = data['user_id']
        self.movie_id = data['movie_id']


    @classmethod
    def save(cls, data):
        query = """
        INSERT INTO movie_links (text, url, user_id, movie_id)
        VALUES ( %(text)s, %(url)s, %(user_id)s, %(movie_id)s )
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def delete(cls, data):
        query = "DELETE FROM movie_links WHERE id = %(id)s;"
        return connectToMySQL(cls.DB).query_db(query, data)

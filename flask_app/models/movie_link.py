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
    def get_all(cls, data):
        all_movie_links = []
        query = """
        SELECT * FROM movie_links
        WHERE user_id = %(user_id)s
        AND movie_id = %(movie_id)s;
        """
        results = connectToMySQL(cls.DB).query_db(query, data)
        for result in results:
            all_movie_links.append(result)
        return all_movie_links


    @classmethod
    def delete(cls, data):
        query = "DELETE FROM movie_links WHERE id = %(id)s;"
        return connectToMySQL(cls.DB).query_db(query, data)

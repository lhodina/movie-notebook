from flask_app.config.mysqlconnection import connectToMySQL

class DirectorLink:
    DB = "movie_notebook"
    def __init__(self, data):
        self.id = data['id']
        self.text = data['text']
        self.url = data['url']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.user_id = data['user_id']
        self.director_id = data['movie_id']


    @classmethod
    def save(cls, data):
        query = """
        INSERT INTO director_links (text, url, user_id, director_id)
        VALUES ( %(text)s, %(url)s, %(user_id)s, %(director_id)s )
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def get_all(cls, data):
        all_director_links = []
        query = """
        SELECT * FROM director_links
        WHERE user_id = %(user_id)s
        AND director_id = %(director_id)s;
        """
        results = connectToMySQL(cls.DB).query_db(query, data)
        for result in results:
            all_director_links.append(result)
        return all_director_links


    @classmethod
    def delete(cls, data):
        query = "DELETE FROM director_links WHERE id = %(id)s;"
        return connectToMySQL(cls.DB).query_db(query, data)

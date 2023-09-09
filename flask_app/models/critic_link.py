from flask_app.config.mysqlconnection import connectToMySQL

class CriticLink:
    DB = "movie_notebook"
    def __init__(self, data):
        self.id = data['id']
        self.text = data['text']
        self.url = data['url']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.user_id = data['user_id']
        self.critic_id = data['movie_id']


    @classmethod
    def save(cls, data):
        query = """
        INSERT INTO critic_links (text, url, user_id, critic_id)
        VALUES ( %(text)s, %(url)s, %(user_id)s, %(critic_id)s )
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def get_all(cls, data):
        all_critic_links = []
        query = """
        SELECT * FROM critic_links
        WHERE user_id = %(user_id)s
        AND critic_id = %(critic_id)s;
        """
        results = connectToMySQL(cls.DB).query_db(query, data)
        for result in results:
            all_critic_links.append(result)
        return all_critic_links


    @classmethod
    def delete(cls, data):
        query = "DELETE FROM critic_links WHERE id = %(id)s;"
        return connectToMySQL(cls.DB).query_db(query, data)

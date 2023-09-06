from flask_app.config.mysqlconnection import connectToMySQL

class Director:
    DB = "movie_notebook"
    def __init__(self, data):
        self.id = data['id']
        self.name = data['name']
        self.image_url = data['image_url']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']


    @classmethod
    def save(cls, data):
        query = """
        INSERT INTO directors (name, image_url)
        VALUES ( %(name)s, %(image_url)s )
        """
        return connectToMySQL(cls.DB).query_db(query, data)


    @classmethod
    def get_all_directors(cls):
        all_directors = []
        query = """
        SELECT * FROM directors;
        """
        results = connectToMySQL(cls.DB).query_db(query)
        for result in results:
            all_directors.append(result)
        return all_directors


    @classmethod
    def get_one(cls, data):
        query = """
        SELECT * FROM directors
        WHERE directors.id = %(id)s;
        """
        result = connectToMySQL(cls.DB).query_db(query, data)[0]
        current_director_data = {
            "id": result["id"],
            "name": result["name"],
            "image_url": result["image_url"],
            "created_at": result["created_at"],
            "updated_at": result["updated_at"]
        }

        current_director = cls(current_director_data)
        return current_director


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

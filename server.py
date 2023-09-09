from flask_app import app
from flask_app.controllers import users, movies, directors, critics, collections, reviews

if __name__=="__main__":
    app.run(debug=True)

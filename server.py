from flask_app import app
from flask_app.controllers import users, movies, directors, critics, collections, reviews, favorite_directors, favorite_critics, movie_links, director_links, critic_links

if __name__=="__main__":
    app.run(debug=True)

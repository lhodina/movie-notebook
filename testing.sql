


-- INSERT INTO director_favorite_movies(director_id, movie_id)
-- VALUES
-- (56, 4), 
-- (56, 5),
-- (56, 19);

SELECT * FROM director_favorite_movies
JOIN directors ON directors.id = director_favorite_movies.director_id
JOIN movies ON movies.id = director_favorite_movies.movie_id
WHERE director_id = 56;

-- SELECT * FROM reviews
-- JOIN movies ON movies.id = reviews.movie_id;

-- INSERT INTO user_favorite_directors(notes, user_id, director_id)
-- VALUES("Brotherly love these brothers", 1, 56);

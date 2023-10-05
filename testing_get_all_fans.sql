SELECT * FROM movies
JOIN reviews ON reviews.movie_id = movies.id
JOIN directors ON directors.id = movies.directed_by_id
LEFT JOIN director_favorite_movies ON director_favorite_movies.movie_id = movies.id
LEFT JOIN directors AS director_fans ON director_fans.id = director_favorite_movies.director_id
LEFT JOIN critic_favorite_movies ON critic_favorite_movies.movie_id = movies.id
LEFT JOIN critics AS critic_fans ON critic_fans.id = critic_favorite_movies.critic_id
WHERE reviews.user_id = 1;
        

-- SELECT * FROM director_favorite_movies;
-- SELECT * FROM critic_favorite_movies; 
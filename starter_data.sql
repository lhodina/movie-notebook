-- INSERT INTO user_favorite_directors (notes, user_id, director_id)
-- VALUES
-- ('Who is this? I do not know who this is', 1, 4),
-- ('', 1, 5);


-- INSERT INTO users (first_name, last_name, email, password)
-- VALUES
-- ('Miss', 'Piggy', 'misspiggy@gmail.com', 'abcd1234'),
-- ('Kermit', 'Frog', 'kfrog@yahoo.com', 'frogt1m3'),
-- ('Beaker', 'Muppet', 'bmupps@gmail.com', 'b3ak3rb3tt3r'),
-- ('Fozzy', 'Bear', 'foz@aol.com', 'w0kkaw0kka');


-- INSERT INTO directors (name, image_url)
-- VALUES
-- ('Michael Curtiz', 'www.greatdirectors.com/asdfoiasdf'),
-- ('Alfred Hitchcock', 'www.greatdirectors.com/plksdddgsdf'),
-- ('John Huston', 'www.greatdirectors.com/eioiklsda'),
-- ('Billy Wilder', 'www.greatdirectors.com/idsglsd'),
-- ('Ernst Lubitsch', 'www.greatdirectors.com/werqwqesdf');


-- INSERT INTO movies (title, image_url, year, directed_by_id)
-- VALUES
-- ('Casablanca', 'www.coolpic.com/cbssadflkjsdaf', 1946, 1),
-- ('Psycho', 'www.somepic.com/cbssadflkjsdaf', 1963, 2),
-- ('Rear Window', 'www.somepic.com/loiasdfdflkjsdaf', 1956, 2),
-- ('The Maltese Falcon', 'www.classicpics.com/cbsssadfflkjsdaf', 1944, 3),
-- ('Some Like It Hot', 'www.coolpic.com/cbssadflkasdfsadsdfdsfh', 1951, 4),
-- ('To Be Or Not To Be', 'www.coolpic.com/cbsshddsadsssjsdaf', 1947, 5);


-- INSERT INTO critics (name, image_url)
-- VALUES
-- ('Roger Ebert', 'www.coolpic.com/cbsshddsadsssjsdaf'),
-- ('Pauline Kael', 'www.coolpic.com/cbsshddsadsssjsdaf'),
-- ('A.O. Scott', 'www.coolpic.com/cbsshddsadsssjsdaf'),
-- ('Manohla Dargis', 'www.coolpic.com/cbsshddsadsssjsdaf'),
-- ('Francois Truffaut', 'www.lesimages.fr/cbsshddsadsssjsdaf');


-- INSERT SOME DIRECTOR FAVORITE MOVIES:
-- INSERT INTO director_favorite_movies (director_id, movie_id)
-- VALUES
-- (2, 4),
-- (2, 5);


-- INSERT SOME USER'S FAVORITE DIRECTORS WITH NOTES:
-- INSERT INTO user_favorite_directors (notes, user_id, director_id)
-- VALUES
-- ('Alfred Hitchcock is a scary scary man', 1, 2),
-- ('Who is Michael Curtiz? Not sure but he is a fave', 1, 1);


-- USE AN ALIAS TABLE NAME IF REFERENCING DIRECTORS TWICE:
-- SELECT * FROM director_favorite_movies
-- JOIN directors ON directors.id = director_favorite_movies.director_id
-- JOIN movies ON movies.id = director_favorite_movies.movie_id
-- JOIN directors AS movie_directors ON movie_directors.id = movies.directed_by_id;

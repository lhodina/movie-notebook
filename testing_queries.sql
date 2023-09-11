
SELECT * FROM movies
JOIN director_favorite_movies ON director_favorite_movies.movie_id = movies.id
WHERE movies.id = 10;

-- SELECT * FROM movies
-- JOIN reviews ON reviews.movie_id = movies.id
-- JOIN directors ON directors.id = movies.directed_by_id
-- WHERE reviews.user_id = 1;

-- SELECT * FROM critic_favorite_movies
-- JOIN critics ON critics.id = critic_favorite_movies.critic_id
-- JOIN movies ON movies.id = critic_favorite_movies.movie_id;

-- SELECT * FROM movies
-- JOIN director_favorite_movies ON director_favorite_movies.movie_id = movies.id
-- JOIN directors ON directors.id = director_favorite_movies.director_id;

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
-- ('Sofia Coppola', 'www.greatdirectors.com/oidsgaoij'),
-- ('Francis Ford Coppola', 'www.greatdirectors.com/iosadgoijdg'),
-- ('Noah Baumbach', 'www.greatdirectors.com/oiasdjlkfj'),
-- ('Greta Gerwig', 'www.greatdirectors.com/oijsadglkjsdf'),
-- ('Federico Fellini', 'www.greatdirectors.it/oasdofisdf'),
-- ('Hiyao Miyazaki', 'www.greatdirectors.com/oijsadlfkjl');


-- INSERT INTO movies (title, image_url, year, directed_by_id)
-- VALUES
-- ('Casablanca', 'www.coolpic.com/cbssadflkjsdaf', 1946, 1),
-- ('Psycho', 'www.somepic.com/cbssadflkjsdaf', 1963, 2),
-- ('Rear Window', 'www.somepic.com/loiasdfdflkjsdaf', 1956, 2),
-- ('The Maltese Falcon', 'www.classicpics.com/cbsssadfflkjsdaf', 1944, 3),
-- ('Some Like It Hot', 'www.coolpic.com/cbssadflkasdfsadsdfdsfh', 1951, 4),
-- ('The Godfather', 'www.coolpic.com/cbsshddsadsssjsdaf', 1972, 6),
-- ('Lost in Translation', 'www.coolpic.com/sdoiajsdafkjl', 2003, 5),
-- ('Francis Ha', 'www.coolpic.com/csadfljsdafljkdsf', 2011, 7),
-- ('Lady Bird', 'www.coolpic.com/asdflkjdsf', 2019, 8),
-- ('La Dolce Vita', 'www.coolpic.com/loisdflkjssdaf', 1961, 9),
-- ('Spirited Away', 'www.coolpic.com/asdfiosdfijf', 2002, 10);


-- INSERT INTO critics (name, image_url)
-- VALUES
-- ('Roger Ebert', 'www.coolpic.com/cbsshddsadsssjsdaf'),
-- ('Pauline Kael', 'www.coolpic.com/cbsshddsadsssjsdaf'),
-- ('A.O. Scott', 'www.coolpic.com/cbsshddsadsssjsdaf'),
-- ('Manohla Dargis', 'www.coolpic.com/cbsshddsadsssjsdaf'),
-- ('Francois Truffaut', 'www.lesimages.fr/cbsshddsadsssjsdaf'),
-- ('Michael Phillips', 'www.chicago-tribute.com/profiles/saoidsfodf'),
-- ('Jean-Luc Godard', 'www.cahiersducinema.fr/bio/uslksdjad'),
-- ('Bosley Crowther', 'www.newyorktimes.com/dead-people/aosidfoisd');

-- INSERT INTO director_favorite_movies (director_id, movie_id)
-- VALUES
-- (5, 10),
-- (6, 10);

-- INSERT INTO critic_favorite_movies(critic_id, movie_id)
-- VALUES
-- (2, 10),
-- (3, 10);

-- INSERT INTO director_favorite_movies (director_id, movie_id)
-- VALUES
-- (2, 2),
-- (2, 4),
-- (2, 6),
-- (2, 8),
-- (2, 10),
-- (8, 1),
-- (8, 3),
-- (8, 5),
-- (8, 7),
-- (8, 10);

-- INSERT INTO user_favorite_directors (notes, user_id, director_id)
-- VALUES
-- ('Alfred Hitchcock is a scary scary man', 1, 2),
-- ('Who is Michael Curtiz? Not sure but he is a fave', 1, 1),
-- ('Greta Girl Yes Yes Yes', 1, 8);

-- INSERT INTO user_favorite_critics (notes, user_id, critic_id)
-- VALUES
-- ('Why is she so cranky?', 1, 2),
-- ('Mr. Know it all. One thumb sideways because I need to hitch a ride the heck away from him', 1, 1),
-- ('Tony Spamoni. Nice guy.', 1, 3);

-- INSERT INTO collections(user_id, name)
-- VALUES
-- (1, "Magical Wheelism"),
-- (1, "Breakfast Food Horror"),
-- (1, "Frog Movies");

-- INSERT INTO reviews(rating, watched, notes, user_id, movie_id)
-- VALUES
-- (5, 1, "LOST IN BILL MURRAY'S EYES", 1, 7),
-- (4, 0, "I haven't seen it but I have to say it's molto bene", 1, 10);
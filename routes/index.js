const express = require("express");
const { requireAuth } = require("../auth");

const { environment } = require("../config");
const { User, Collection, Movie, Director, FavoriteDirector, Critic, FavoriteCritic, UserNote } = require("../db/models");
const { asyncHandler, csrfProtection } = require("../utils");

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
    if (req.session.auth) {
        const { userId } = req.session.auth;

        const user = await User.findByPk(userId, {
            include:
                [
                    {
                        model: Director,
                        include: User
                    },
                    {
                        model: Critic,
                        include: User
                    }
                ]
        });

        const favoriteDirectors = user.dataValues.Directors;
        const favoriteDirectorNames = favoriteDirectors.map(director => director.name)

        const favoriteCritics = user.dataValues.Critics;
        const favoriteCriticNames = favoriteCritics.map(critic => critic.name);

        const directors = await Director.findAll({ include: Movie });

        const collections = await Collection.findAll({
            where: { userId },
            include:
                {
                    model: Movie,
                    include: [
                        { model: Director },
                        {
                            model: Critic,
                            include: { model: Movie }
                        },
                        { model: UserNote }
                    ]
                }
        }).map((collectionData) => {
            const collection = collectionData.dataValues;
            const collectionName = collection.name;

            const movies = collection.Movies.map((movieData) => {
                const data = movieData.dataValues;

                const critics = data.Critics.map(criticData => criticData.dataValues).filter(critic => favoriteCriticNames.includes(critic.name));
            
                let cleanedMovie = {
                    id: data.id,
                    title: data.title,
                    director: data.Director.name,
                    yearReleased: data.yearReleased,
                    imageLink: data.imageLink,
                    likedByDirectors: [],
                    likedByCritics: critics
                };

                for (let director of directors) {
                    const movies = director.dataValues.Movies;
                    for (let movieData of movies) {
                        const movie = movieData.dataValues;
                        if ( movie.title === cleanedMovie.title && favoriteDirectorNames.includes(director.name)) {
                            cleanedMovie.likedByDirectors.push(director.name);
                        }
                    }
                }

                const userNotes = data.UserNotes;
                let userNote;

                if (userNotes.length) {
                    userNote = userNotes[0].dataValues;
                    cleanedMovie.review = userNote.review;
                    cleanedMovie.rating = userNote.rating;
                    cleanedMovie.watchedStatus = userNote.watchedStatus
                }

                // console.log("*****cleanedMovie:", cleanedMovie);
                return cleanedMovie;
            });


            const displayShelf = {
                id: collection.id,
                name: collectionName,
                movies
            }
            return displayShelf;
        });

        res.render("user-home", {
            collections,
            user,
            favoriteDirectors,
            favoriteCritics
        });
    } else {
        res.render("index", {
            title: "MOVIE NOTEBOOK",
        });
    }
}));



router.get("/favorite-directors/add", csrfProtection, requireAuth, asyncHandler(async (req, res) => {
    const directors = await Director.findAll();
    res.render("favorite-director-add", {
        directors,
        csrfToken: req.csrfToken()
    });
}));


router.post("/favorite-directors/add", csrfProtection, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const { directorName } = req.body;
    let director = await Director.findOne({ where: { name: directorName } });
    if (!director) {
        director = await Director.create({
            name: directorName
        });
    }

    const favoriteDirector = await FavoriteDirector.create({
        userId,
        directorId: director.id
    });

    res.redirect("/");
}));


router.get("/favorite-critics/add", csrfProtection, requireAuth, asyncHandler(async (req, res) => {
    const critics = await Critic.findAll();
    res.render("favorite-critic-add", {
        critics,
        csrfToken: req.csrfToken()
    });
}));


router.post("/favorite-critics/add", csrfProtection, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const { criticName } = req.body;
    let critic = await Critic.findOne({ where: { name: criticName } });
    if (!critic) {
        critic = await Critic.create({
            name: criticName
        });
    }

    const favoriteCritic = await FavoriteCritic.create({
        userId,
        criticId: critic.id
    });

    res.redirect("/");
}));



if (environment !== "production") {
    router.get("/error-test", () => {
        throw new Error("TEST ERROR...");
    });
}


module.exports = router;

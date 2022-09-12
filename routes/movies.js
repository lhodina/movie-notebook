const express = require("express");
const { check, validationResult } = require("express-validator");
const { Op } = require("sequelize");

const { csrfProtection, asyncHandler, getYears, getMovies } = require("../utils");
const db = require("../db/models");
const { Movie, MovieCollection, Director, User, UserNote, Collection, Critic } = db;
const { requireAuth } = require("../auth");

const router = express.Router();

const years = getYears();

const validateMovie = [
    check("title")
        .exists({ checkFalsy: true })
        .withMessage("Please enter a movie title"),
    check("directorId")
        .exists({ checkFalsy: true })
        .withMessage("Please include a director")
];


router.get("/", async (req, res) => {
    let user;
    if (req.session.auth) {
        const { userId } = req.session.auth;

        user = await User.findByPk(userId, {
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
    }

    const allMovies = await Movie.findAll({ include: ["movieDirector", "favoritedByDirectors", Critic, UserNote] });
    const movies = getMovies(allMovies, user)
    const directors = await Director.findAll();

    res.render("movies", {
        movies,
        directors
    });
});


router.get("/add", csrfProtection, validateMovie, asyncHandler(async (req, res) => {
    const movies = await Movie.findAll();
    const directors = await Director.findAll();

    if (req.session.auth) {
        const { userId } = req.session.auth;
        const collections = await Collection.findAll({ where: { userId } });

        res.render("movie-add", {
            movies,
            directors,
            collections,
            years,
            csrfToken: req.csrfToken()
        });
    } else {
        res.render("movie-add", {
            movies,
            directors,
            years,
            csrfToken: req.csrfToken()
        });
    }
}));


router.post("/add", csrfProtection, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;

    let {
        directorName,
        title,
        yearReleased,
        imageLink,
        starRating,
        review,
        collectionList,
        watchedStatus
    } = req.body;

    let director;

    if (directorName) {
        director = await Director.findOne({ where: { name: directorName } });
        if (!director) {
            director = await Director.create({
                name: directorName
            });
        }
    }

    const directorId = director.id;

    if (yearReleased === "--Year--") yearReleased = null;

    if (req.session.auth) {
        const movie = await Movie.create({
            title,
            directorId,
            yearReleased,
            imageLink
        });

        let rating;
        if (starRating) {
            rating = parseInt(starRating, 10);
        }


        if (rating || review || watchedStatus !== undefined) {
            await UserNote.create({
                userId,
                movieId: movie.id,
                review,
                rating,
                watchedStatus
            });
        }


        if (collectionList) {
            let collection = await Collection.findOne({ where: { name: collectionList }});

            if (!collection) {
                collection = await Collection.create({
                    name: collectionList,
                    userId
                });
            }

            await MovieCollection.create({
                movieId: movie.id,
                collectionId: collection.id
            });
        }
    }

    res.redirect("/");
}));


router.get("/:id", csrfProtection, asyncHandler(async (req, res) => {
    const movieId = parseInt(req.params.id, 10);
    const movie = await Movie.findByPk(movieId, { include: ['movieDirector', Collection] });
    const directors = await Director.findAll();
    const director = movie.dataValues.movieDirector;

    if (req.session.auth) {
        const { userId } = req.session.auth;
        const userNotesData = await UserNote.findOne({
            where: {
                [Op.and]: [
                    { userId },
                    { movieId }
                ]
            }
        });

        let userNotes;
        if (userNotesData) {
            userNotes = userNotesData.dataValues;
        }

        const collectionsData = movie.dataValues.Collections;

        const movieCollections = collectionsData.map(collection => collection.dataValues);
        const movieCollectionNames = collectionsData.map(collection => collection.dataValues.name);

        const userCollections = await Collection.findAll({ where: { userId: userId} });

        res.render("movie", {
            movie,
            director,
            directors,
            userCollections,
            movieCollections,
            movieCollectionNames,
            userNotes,
            years,
            csrfToken: req.csrfToken()
         });
    } else {
        res.render("movie", {
            movie,
            director,
            directors,
            years
         });
    }
}));


router.put("/:id", asyncHandler(async (req, res, next) => {
    const { userId } = req.session.auth;
    const movieId = parseInt(req.params.id, 10);
    const movie = await Movie.findByPk(movieId);

    let {
        title,
        directorName,
        yearReleased,
        imageLink,
        starRating,
        review,
        collectionList,
        watchedStatus
    } = req.body;

    let director;

    if (directorName) {
        director = await Director.findOne({ where: { name: directorName } });

        if (!director) {
            director = await Director.create({ name: directorName });
        }
    }


    if (movie) {
        await movie.update({
            title,
            directorId: director.dataValues.id,
            yearReleased,
            imageLink
        });
    }

    let userNote = await UserNote.findOne({ where: {
        [Op.and]: [
            { userId },
            { movieId }
        ]
    } });

    if (!userNote && (review || rating || watchedStatus !== undefined)) {
        userNote = await UserNote.create({
            userId,
            movieId,
            review,
            rating: starRating,
            watchedStatus
        });
    } else if (userNote) {
        await userNote.update({
            userId,
            movieId,
            review,
            rating: starRating,
            watchedStatus
        });
    }

    if (collectionList) {
        let collection = await Collection.findOne({ where: { name: collectionList } });
        if (!collection) {
            await Collection.create({
                name: collectionList,
                userId
            });
        }

        await MovieCollection.create({
            movieId,
            collectionId: collection.id
        });
    }

    res.redirect("/");
}));


router.delete("/:id", asyncHandler(async (req, res, next) => {
    const movieId = req.params.id;
    const movie = await Movie.findByPk(movieId);
    if (movie) {
        await movie.destroy();
        res.json({ message: "Success"})
    } else {
        console.log("Couldn't get movie");
    }
}));


module.exports = router;

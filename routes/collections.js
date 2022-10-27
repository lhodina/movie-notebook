const express = require("express");
const { Op } = require("sequelize");
const { check, oneOf, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler, handleValidationErrors, getYears } = require("../utils");
const db = require("../db/models");
const { Collection, MovieCollection, Movie, Director, UserNote, Link } = db;
const { requireAuth } = require("../auth");

const router = express.Router();

const years = getYears();

const validateCollection = [
    check("collectionName")
        .exists({ checkFalsy: true })
            .withMessage("Collection name required"),
    oneOf([
        check("title")
            .exists({ checkFalsy: true })
        ,
        check("movieSearchRes")
            .exists({ checkFalsy: true })
    ], "Please include a movie")
];

router.get("/add", requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const movies = await Movie.findAll({ include: UserNote });
    const directors = await Director.findAll();

    res.render("collection-add", {
        movies,
        directors,
        years,
        csrfToken: req.csrfToken()
    });
}));


router.post("/add", requireAuth, csrfProtection, validateCollection, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const { collectionName } = req.body;

    const movies = await Movie.findAll({ include: UserNote });
    const directors = await Director.findAll();

    const validatorErrors = validationResult(req);

    if (!validatorErrors.isEmpty()) {
        const errors = validatorErrors.array().map((error) => error.msg);

        res.render("collection-add", {
            movies,
            directors,
            years,
            errors,
            csrfToken: req.csrfToken()
        });
    } else {
        const collection = await Collection.create({
            name: collectionName,
            userId
        });

        // const { selectMovie } = req.body;
        const { movieSearchRes } = req.body;
        const directorName = req.body.directorName;

        let director;

        if (directorName) {
            director = await Director.findOne({ where: { name: directorName } });
            if (!director) {
                director = await Director.create({
                    name: directorName
                });
            }
        }

        let {
            title,
            yearReleased,
            imageLink,
            starRating,
            review,
            watchedStatus
        } = req.body;

        if (yearReleased === "--Year--") yearReleased = 0;

        let rating;
        if (starRating) {
            rating = parseInt(starRating, 10);
        }

        let movie;

        if (movieSearchRes) {
            movie = await Movie.findOne({ where: { title: movieSearchRes } });
        } else {
            movie = await Movie.create({
                title,
                directorId: director.id,
                yearReleased,
                imageLink
            });
        }

        if (movie) {
            await MovieCollection.create({
                movieId: movie.id,
                collectionId: collection.id
            });
        }

        let userNote = await UserNote.findOne({ where: {
            [Op.and]: [
                { userId },
                { movieId: movie.id }
            ]
        } });


        if (!userNote && (review || rating || watchedStatus !== undefined)) {
            userNote = await UserNote.create({
                userId,
                movieId: movie.id,
                review,
                rating,
                watchedStatus
            });
        } else if (userNote) {
            await userNote.update({
                userId,
                movieId: movie.id,
                review,
                rating,
                watchedStatus
            });
        }

        res.redirect("/");
    }
}));


router.get("/:id", csrfProtection, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const userCollections = await Collection.findAll({ where: { userId } });

    const collectionId = parseInt(req.params.id, 10);
    const collection = await Collection.findByPk(collectionId, {
        include: {
            model: Movie,
            include: [
                "movieDirector",
                UserNote
            ]
        }
    });

    const collectionMovies = collection.dataValues.Movies.map(data =>
        {
            const movie = data.dataValues;
            const director = movie.movieDirector.dataValues.name;
            movie.director = director;

            if (movie.UserNotes.length) {
                const userNotes = movie.UserNotes[0].dataValues;
                movie.review = userNotes.review;
                movie.rating = userNotes.rating;
                movie.watchedStatus = userNotes.watchedStatus;
            }

            return movie;
        });

    const movies = await Movie.findAll();
    const directors = await Director.findAll();

    res.render("collection", {
        collection,
        movies,
        collectionMovies,
        userCollections,
        directors,
        years,
        csrfToken: req.csrfToken()
    });
}));


router.post("/:id", csrfProtection, asyncHandler(async (req, res) => {
    console.log('req.body:', req.body)
    const { userId } = req.session.auth;
    const collectionId = parseInt(req.params.id, 10);
    // const { selectMovie } = req.body;
    const { movieSearchRes } = req.body;

    const directorName = req.body.directorName;

    let director;

    if (directorName) {
        director = await Director.findOne({ where: { name: directorName } });
        if (!director) {
            director = await Director.create({
                name: directorName
            });
        }
    }

    let {
        title,
        yearReleased,
        imageLink,
        starRating,
        review,
        watchedStatus,
        linkText,
        linkUrl
    } = req.body;

    if (yearReleased === "--Year--") yearReleased = 0;
    let rating;
    if (starRating) {
        rating = parseInt(starRating, 10);
    }

    let movie;

    if (movieSearchRes) {
        movie = await Movie.findOne({ where: { title: movieSearchRes } });
    } else {
        movie = await Movie.create({
            title,
            directorId: director.id,
            yearReleased,
            imageLink
        });
    }

    if (review || rating || watchedStatus !== undefined) {
        await UserNote.create({
            userId,
            movieId: movie.id,
            review,
            rating,
            watchedStatus
        });
    }

    await MovieCollection.create({
        movieId: movie.id,
        collectionId
    });

    if (linkText && linkUrl) {
        await Link.create({
            userId,
            table: "Movie",
            tableItemId: movie.id,
            linkText,
            linkUrl
        });
    }

    res.redirect(`/`);
}));


router.delete("/:id", asyncHandler(async (req, res, next) => {
    const collectionId = req.params.id;
    const collection = await Collection.findByPk(collectionId);
    if (collection) {
        await collection.destroy();
        res.json({ message: "Success"})
    } else {
        console.log("Couldn't get collection");
    }
}));


router.delete("/:id/:movieId", asyncHandler(async (req, res, next) => {
    const collectionId = req.params.id;
    const movieId = req.params.movieId;

    const movieCollection = await MovieCollection.findOne({
        where: {
            [Op.and]: [
                { movieId },
                { collectionId }
            ]
        }
    });

    await movieCollection.destroy();

    const collection = await Collection.findByPk(collectionId);
    if (collection.name === "Want to Watch") {
        const userNote = await UserNote.findByPk(movieId);
        userNote.update({ watchedStatus: null })
    }

    res.json({ message: "Success"})
}));


module.exports = router;

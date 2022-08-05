const express = require("express");
const { check, validationResult } = require("express-validator");
const { Op } = require("sequelize");

const { csrfProtection, asyncHandler, getYears } = require("../utils");
const db = require("../db/models");
const { Movie, Director, UserNote, Collection } = db;
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
    const movies = await Movie.findAll();
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
        const collections = await Collection.findAll({ where: userId });
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
    const name = req.body.directorId;

    let director = await Director.findOne({ where: { name } });
    if (!director) {
        director = await Director.create({
            name
        });
    }

    const directorId = director.id;

    let {
        title,
        yearReleased,
        imageLink,
        collectionList
    } = req.body;

    if (typeof yearReleased !== "number") yearReleased = null;

    const movie = await Movie.create({
        title,
        directorId,
        yearReleased,
        imageLink
    });

    if (req.session.auth) {
        const { userId } = req.session.auth;
        if (collectionList) {
            let collection = await Collection.findOne({ where: { name: collectionList }});

            if (!collection) {
                collection = await Collection.create({
                    name: collectionList.name,
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
    const movie = await Movie.findByPk(movieId, { include: Director });
    const directors = await Director.findAll();
    const director = movie.dataValues.Director;

    if (req.session.auth) {
        const { userId } = req.session.auth;
        const userNotes = await UserNote.findOne({
            where: {
                [Op.and]: [
                    { userId },
                    { movieId }
                ]
            }
        });

        const collections = await Collection.findAll({ where: userId });

        res.render("movie", {
            movie,
            director,
            directors,
            collections,
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


router.get("/:id/add-notes", requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const movieId = parseInt(req.params.id, 10);
    const movie = await Movie.findByPk(movieId);
    res.render("user-note-add", {
        movie,
        csrfToken: req.csrfToken()
    });
}));


router.post("/:id/add-notes", requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    console.log("req.body:", req.body);
    const { userId } = req.session.auth;
    const movieId = parseInt(req.params.id, 10);

    let {
        review,
        watchedStatus,
        starRating
    } = req.body;

    const userNote = await UserNote.findOne({
        where: {
            [Op.and]: [ {userId}, {movieId} ]
        }
    })

    if (userNote) {
        await userNote.update({
            userId,
            movieId,
            review,
            rating: starRating,
            watchedStatus
        });
    } else {
        await UserNote.create({
            userId,
            movieId,
            review,
            rating: starRating,
            watchedStatus
        });
    }

    res.redirect("/");
}));


module.exports = router;

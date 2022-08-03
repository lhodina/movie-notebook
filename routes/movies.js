const express = require("express");
const { check, validationResult } = require("express-validator");
const { Op } = require("sequelize");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");
const { Movie, Director, User, UserNote } = db;
const { requireAuth } = require("../auth");

const router = express.Router();


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


router.get("/add", csrfProtection, asyncHandler(async (req, res) => {
    const movies = await Movie.findAll();
    const directors = await Director.findAll();
    let years = [];
    let today = new Date().getFullYear();
    for (let i = 1920; i < today + 1; i++) {
        years.push(i);
    }

    res.render("movie-add", {
        movies,
        directors,
        years,
        csrfToken: req.csrfToken()
    });
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

    const {
        title,
        yearReleased,
        imageLink
    } = req.body;

    const movie = await Movie.create({
        title,
        directorId,
        yearReleased,
        imageLink
    });

    res.redirect("/movies");
}));


router.get("/:id", csrfProtection, asyncHandler(async (req, res) => {
    const movieId = parseInt(req.params.id, 10);
    const movie = await Movie.findByPk(movieId);
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

        res.render("movie", {
            movie,
            userNotes,
            csrfToken: req.csrfToken()
         });
    } else {
        res.render("movie", { movie });
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

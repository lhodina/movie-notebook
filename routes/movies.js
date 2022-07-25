const express = require("express");
const { check, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");
const { Movie, Director } = db;
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
    res.send(movies);
});


router.get("/add", requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const movies = await Movie.findAll();
    const directors = await Director.findAll();
    res.render("movie-add", {
        movies,
        directors,
        csrfToken: req.csrfToken()
    });
}));


router.post("/", csrfProtection, asyncHandler(async (req, res) => {
    console.log("req.body:", req.body);

    const name = req.body.directorId;
    console.log("name:", name);

    let director = await Director.findOne({ where: { name } });
    console.log("director:", director);

    if (!director) {
        director = await Director.create({
            name
        });
    }

    const directorId = director.id;
    console.log("directorId:", directorId);

    const {
        title,
        releaseDate,
        imageLink
    } = req.body;

    const movie = await Movie.create({
        title,
        directorId,
        releaseDate,
        imageLink
    });

    res.redirect("/movies");
}));



module.exports = router;

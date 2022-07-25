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
    const directors = await Director.findAll();
    for (let director of directors) {
        for (let movie of movies) {
            if (movie.directorId === director.id) {
                movie.directorName = director.name;
            }
        }
    }

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
    for (let i = 1888; i < today + 1; i++) {
        years.push(i);
    }

    console.log("years:", years);

    res.render("movie-add", {
        movies,
        directors,
        years,
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



module.exports = router;

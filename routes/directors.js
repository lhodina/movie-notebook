const express = require("express");
const { check, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler, getYears } = require("../utils");
const db = require("../db/models");
const { Director, Movie, DirectorFavorite } = db;
const { requireAuth } = require("../auth");

const router = express.Router();

const years = getYears();

const validateDirector = [
    check("name")
        .exists({ checkFalsy: true })
        .withMessage("Please enter a director name"),
];


router.get("/", async (req, res) => {
    const directors = await Director.findAll();
    res.render("directors", {
        directors
    });
});


router.get("/add", csrfProtection, asyncHandler(async (req, res) => {
    res.render("director-add", {
        csrfToken: req.csrfToken()
    });
}));


router.post("/add", validateDirector, csrfProtection, asyncHandler(async (req, res) => {
    const { name } = req.body;
    await Director.create({
        name
    });
    res.redirect("/directors");
}));


router.get("/:id", csrfProtection, asyncHandler(async (req, res) => {
    const directorId = parseInt(req.params.id, 10);
    const directors = await Director.findAll();
    const movies = await Movie.findAll();

    const director = await Director.findByPk(directorId, {
        include: ['directedMovies', 'directorFavorites']
    });

    const directedMovies = director.dataValues.directedMovies;
    const favoriteMovies = director.dataValues.directorFavorites;

    res.render("director", {
        director,
        directors,
        movies,
        years,
        directedMovies,
        favoriteMovies,
        csrfToken: req.csrfToken()
    });
}));


router.post("/:id/favorites/add", csrfProtection, asyncHandler(async (req, res) => {
    const { selectMovie} = req.body;
    let movie;

    const directorName = req.body.directorName;

    let director = await Director.findOne({ where: { name: directorName } });
    if (!director) {
        director = await Director.create({
            name: directorName
        });
    }

    let {
        title,
        yearReleased,
        imageLink
    } = req.body;

    if (yearReleased === "--Year--") yearReleased = null;

    if (selectMovie !== "--Choose Movie--") {
        movie = await Movie.findOne({ where: { title: selectMovie } });
    } else {
        movie = await Movie.create({
            title,
            directorId: director.id,
            yearReleased,
            imageLink
        });
    }

    await DirectorFavorite.create({
        director_Id: director.id,
        movieId: movie.id,
    });

    res.redirect(`/directors/${director.id}`);
}));


router.delete("/:id", asyncHandler(async (req, res, next) => {
    const directorId = req.params.id;
    const director = await Director.findByPk(directorId);
    if (director) {
        await director.destroy();
        res.json({ message: "Success"})
    } else {
        console.log("DANGER WILL ROBINSON. Couldn't get director");
    }
}));


module.exports = router;

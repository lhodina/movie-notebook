const express = require("express");
const { check, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler, getYears } = require("../utils");
const db = require("../db/models");
const { Critic, CriticFavorite, Movie, Director } = db;
const { requireAuth } = require("../auth");

const router = express.Router();

const years = getYears();

router.get("/", asyncHandler(async (req, res) => {
    const critics = await Critic.findAll();
    res.render("critics", {
        critics
    });
}));


router.get("/add", csrfProtection, asyncHandler(async (req, res) => {
    res.render("critic-add", {
        csrfToken: req.csrfToken()
    });
}));


router.post("/add", csrfProtection, asyncHandler(async (req, res) => {
    const { name } = req.body;
    const critic = await Critic.create({ name });
    res.redirect("/critics")
}));


router.get("/:id", csrfProtection, asyncHandler(async (req, res) => {
    const criticId = parseInt(req.params.id, 10);
    const movies = await Movie.findAll();
    const directors = await Director.findAll();

    const critic = await Critic.findByPk(criticId, {
        include: {
            model: Movie,
            include: Director
        }
    });

    const favoriteMovies = critic.dataValues.Movies.map(movieData => {
        const data = movieData.dataValues;
        const movie = {
            title: data.title,
            director: data.Director.name,
            yearReleased: data.yearReleased,
            imageLink: data.imageLink
        };

        return movie;
    });

    res.render("critic", {
        critic,
        movies,
        directors,
        years,
        favoriteMovies,
        csrfToken: req.csrfToken()
    });
}));


router.post("/:id/favorites/add", csrfProtection, asyncHandler (async (req, res) => {
    const { selectFavorite } = req.body;
    console.log("selectFavorite:", selectFavorite);
    let movie;

    const directorName = req.body.directorId;

    let director = await Director.findOne({ where: { name: directorName } });
    if (!director) {
        director = await Director.create({
            name: directorName
        });
    }

    const {
        title,
        yearReleased,
        imageLink
    } = req.body;

    if (selectFavorite !== "--Choose Movie--") {
        movie = await Movie.findOne({ where: { title: selectFavorite } });
    } else {
        movie = await Movie.create({
            title,
            directorId: director.id,
            yearReleased,
            imageLink
        });
    }

    const criticId = parseInt(req.params.id, 10);

    const criticFavorite = await CriticFavorite.create({
        criticId,
        movieId: movie.id,
    });

    res.redirect(`/critics/${criticId}`);
}));


module.exports = router;

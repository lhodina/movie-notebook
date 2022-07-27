const express = require("express");
const { check, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");
const { Critic, CriticFavorite, Movie, Director } = db;
const { requireAuth } = require("../auth");

const router = express.Router();


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
    const critic = await Critic.findByPk(criticId);
    const movies = await Movie.findAll();
    const directors = await Director.findAll();
    let years = [];
    let today = new Date().getFullYear();
    for (let i = 1888; i < today + 1; i++) {
        years.push(i);
    }

    const favoriteMovies = await Movie.findAll({include: [
        {
            model: Critic,
            attributes: ['id', 'name'],
            where: { id: criticId }
        }
    ]});

    console.log("favoriteMovies:", favoriteMovies);

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

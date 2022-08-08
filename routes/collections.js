const express = require("express");
const { check, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler, getYears } = require("../utils");
const db = require("../db/models");
const { Collection, MovieCollection, Movie, Director } = db;
const { requireAuth } = require("../auth");

const router = express.Router();

const years = getYears();

router.get("/add", requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const movies = await Movie.findAll();
    const directors = await Director.findAll();


    res.render("collection-add", {
        movies,
        directors,
        years,
        csrfToken: req.csrfToken()
    });
}));


router.post("/add", csrfProtection, asyncHandler(async (req, res) => {
    console.log("req.body:", req.body);

    const { userId } = req.session.auth;
    const { collectionName } = req.body;

    const collection = await Collection.create({
        name: collectionName,
        userId
    });

    const { selectMovie } = req.body;
    console.log("selectMovie:", selectMovie);
    let movie;

    const directorName = req.body.directorId;

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

    if (typeof yearReleased !== "number") yearReleased = null;

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

    if (movie) {
        await MovieCollection.create({
            movieId: movie.id,
            collectionId: collection.id
        });
    }

    res.redirect("/");
}));


router.get("/:id", csrfProtection, asyncHandler(async (req, res) => {
    const collectionId = parseInt(req.params.id, 10);
    const collection = await Collection.findByPk(collectionId, { include: Movie });
    const collectionMovies = collection.dataValues.Movies.map(data => data.dataValues)
    const movies = await Movie.findAll();
    const directors = await Director.findAll();

    console.log("*****collectionMovies:", collectionMovies);

    res.render("collection", {
        collection,
        movies,
        collectionMovies,
        directors,
        years,
        csrfToken: req.csrfToken()
    });
}));


router.post("/:id/add-movie", csrfProtection, asyncHandler(async (req, res) => {
    const collectionId = parseInt(req.params.id, 10);
    const { selectMovie } = req.body;
    console.log("selectMovie:", selectMovie);
    let movie;

    const directorName = req.body.directorId;

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

    if (typeof yearReleased !== "number") yearReleased = null;

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

    await MovieCollection.create({
        movieId: movie.id,
        collectionId
    });

    res.redirect('/');
}));


module.exports = router;

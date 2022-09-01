const express = require("express");
const { Op } = require("sequelize");
const { check, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler, getYears } = require("../utils");
const db = require("../db/models");
const { Collection, MovieCollection, Movie, Director, UserNote } = db;
const { requireAuth } = require("../auth");

const router = express.Router();

const years = getYears();

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


router.post("/add", requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const { collectionName } = req.body;

    const collection = await Collection.create({
        name: collectionName,
        userId
    });

    const { selectMovie } = req.body;
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
        imageLink,
        starRating,
        review,
        watchedStatus
    } = req.body;

    if (yearReleased === "--Year--") yearReleased = null;

    let rating;
    if (starRating) {
        rating = parseInt(starRating, 10);
    }


    let movie;
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

    await UserNote.create({
        userId,
        movieId: movie.id,
        review,
        rating,
        watchedStatus
    });

    res.redirect("/");
}));


router.get("/:id", csrfProtection, asyncHandler(async (req, res) => {
    const collectionId = parseInt(req.params.id, 10);
    const collection = await Collection.findByPk(collectionId, {
        include: {
            model: Movie,
            include: "movieDirector"
        }
    });

    const collectionMovies = collection.dataValues.Movies.map(data =>
        {
            const movie = data.dataValues;
            const director = movie.movieDirector.dataValues.name;
            movie.director = director;
            return movie;
        });

    const movies = await Movie.findAll();
    const directors = await Director.findAll();

    res.render("collection", {
        collection,
        movies,
        collectionMovies,
        directors,
        years,
        csrfToken: req.csrfToken()
    });
}));


router.post("/:id", csrfProtection, asyncHandler(async (req, res) => {
    console.log("*****req.body:", req.body);
    const { userId } = req.session.auth;
    const collectionId = parseInt(req.params.id, 10);
    const { selectMovie } = req.body;

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
        imageLink,
        starRating,
        review,
        watchedStatus
    } = req.body;

    if (yearReleased === "--Year--") yearReleased = null;

    let rating;
    if (starRating) {
        rating = parseInt(starRating, 10);
    }

    let movie;

    if (selectMovie !== "--Choose Movie--") {
        movie = await Movie.findOne({ where: { title: selectMovie } });
    } else {
        movie = await Movie.create({
            title,
            directorId: director.id,
            yearReleased,
            imageLink
        });

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

    res.redirect(`/collections/${collectionId}`);
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
    console.log("*****collectionId:", collectionId);
    const movieId = req.params.movieId;
    console.log("*****movieId:", movieId);

    const movieCollection = await MovieCollection.findOne({
        where: {
            [Op.and]: [
                { movieId },
                { collectionId }
            ]
        }
    });

    await movieCollection.destroy();
    res.json({ message: "Success"})
}));


module.exports = router;

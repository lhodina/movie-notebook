const express = require("express");
const { check, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");
const { Collection, MovieCollection, Movie, Director } = db;
const { requireAuth } = require("../auth");

const router = express.Router();


router.get("/add", requireAuth, csrfProtection, asyncHandler(async (req, res) => {
    const movies = await Movie.findAll();
    const directors = await Director.findAll();
    let years = [];
    let today = new Date().getFullYear();
    for (let i = 1888; i < today + 1; i++) {
        years.push(i);
    }
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
        user_Id: userId
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

    const {
        title,
        yearReleased,
        imageLink
    } = req.body;

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

    res.redirect("/");
}));



module.exports = router;

const express = require("express");
const { check, validationResult, oneOf } = require("express-validator");
const { Op } = require("sequelize");
const { csrfProtection, asyncHandler, getYears, getCritic } = require("../utils");
const db = require("../db/models");
const { Critic, FavoriteCritic, CriticFavorite, Movie, Director, Link } = db;
const { requireAuth } = require("../auth");

const router = express.Router();

const validateCritic = [
    check("name")
        .exists({ checkFalsy: true })
        .withMessage("Please enter a critic name")
];

const validateFavoriteMovie = [
    oneOf([
        check("title")
            .exists({ checkFalsy: true }),
        check("selectMovie")
            .exists({ checkFalsy: true })
    ], "Please enter a movie title")
    ,
    oneOf([
        check("director")
            .exists({ checkFalsy: true }),
        check("selectMovie")
            .exists({ checkFalsy: true })
    ], "Please enter a director")
];

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


router.post("/add", csrfProtection, validateCritic, asyncHandler(async (req, res) => {
    const validatorErrors = validationResult(req);

    if (!validatorErrors.isEmpty()) {
        const errors = validatorErrors.array().map((error) => error.msg);

        res.render("critic-add", {
            errors,
            csrfToken: req.csrfToken()
        });
    } else {
        const { name } = req.body;
        await Critic.create({ name });
        res.redirect("/critics")
    }
}));


router.get("/:id", csrfProtection, asyncHandler(async (req, res) => {
    const criticId = parseInt(req.params.id, 10);
    getCritic(req, res, criticId);
}));


router.post("/:id/favorites/add", validateFavoriteMovie, csrfProtection, asyncHandler (async (req, res) => {
    const criticId = parseInt(req.params.id, 10);

    const validatorErrors = validationResult(req);
    if (!validatorErrors.isEmpty()) {
        const errors = validatorErrors.array().map((error) => error.msg);
        getCritic(req, res, criticId, errors);
    } else {
        let movie;

        let {
            title,
            selectMovie,
            yearReleased,
            imageLink
        } = req.body;

        if (selectMovie !== "--Choose Movie--") {
            movie = await Movie.findOne({ where: { title: selectMovie } });
        } else {
            const directorName = req.body.directorName;

            let director;

            if (directorName) {
                director = await Director.findOne({ where: { name: directorName } });
                if (!director) {
                    director = await Director.create({
                        name: directorName
                    });
                }
            }

            if (yearReleased === "--Year--") yearReleased = 0;

            movie = await Movie.create({
                title,
                directorId: director.id,
                yearReleased,
                imageLink
            });
        }

        await CriticFavorite.create({
            criticId,
            movieId: movie.id,
        });

        res.redirect(`/critics/${criticId}`);
    }
}));


router.post("/:id/notes", csrfProtection, asyncHandler(async (req, res, next) => {
    const { userId } = req.session.auth;
    let { notes } = req.body;
    const criticId = parseInt(req.params.id, 10);
    const favoriteCritic = await FavoriteCritic.findOne({ where: { userId, criticId }});
    await favoriteCritic.update({ userId, criticId, notes });
    res.redirect("/");
}));


router.post("/:id/links", csrfProtection, asyncHandler(async (req, res, next) => {
    const { userId } = req.session.auth;
    let { linkText, linkUrl } = req.body;
    const criticId = parseInt(req.params.id, 10);

    await Link.create({
        userId,
        table: "Critic",
        tableItemId: criticId,
        linkText,
        linkUrl
    });
}));


router.delete("/:id/favorites/:movieId", asyncHandler(async (req, res, next) => {
    const criticId = req.params.id;
    const movieId = req.params.movieId;

    const criticFav = await CriticFavorite.findOne({ where: {
        criticId,
        movieId
    } });

    await criticFav.destroy();
    res.json({ message: "Success" });
}));



router.delete("/:id", asyncHandler(async (req, res, next) => {
    const criticId = req.params.id;
    const critic = await Critic.findByPk(criticId);
    if (critic) {
        await critic.destroy();
        res.json({ message: "Success"})
    } else {
        console.log("Couldn't get critic");
    }
}));


module.exports = router;

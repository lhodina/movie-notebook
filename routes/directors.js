const express = require("express");
const { check, validationResult, oneOf } = require("express-validator");

const { csrfProtection, asyncHandler, getYears, getDirector } = require("../utils");
const db = require("../db/models");
const { Director, Movie, DirectorFavorite, FavoriteDirector, Link } = db;
const { requireAuth } = require("../auth");

const router = express.Router();

const validateDirector = [
    check("name")
        .exists({ checkFalsy: true })
        .withMessage("Please enter a director name"),
];

const validateFavoriteMovie = [
    oneOf([
        check("title")
            .exists({ checkFalsy: true }),
        check("movieSearchRes")
            .exists({ checkFalsy: true })
    ], "Please enter a movie title")
    ,
    oneOf([
        check("director")
            .exists({ checkFalsy: true }),
        check("movieSearchRes")
            .exists({ checkFalsy: true })
    ], "Please enter a director")
];

const validateDirectedMovie = [
    check("title")
        .exists({ checkFalsy: true })
        .withMessage("Please enter a movie title"),
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
    const validatorErrors = validationResult(req);

    if (!validatorErrors.isEmpty()) {
        const errors = validatorErrors.array().map((error) => error.msg);

        res.render("director-add", {
            errors,
            csrfToken: req.csrfToken()
        });
    } else {
        const { name } = req.body;
        await Director.create({
            name
        });
        res.redirect("/directors");
    }
}));


router.get("/:id", csrfProtection, asyncHandler(async (req, res) => {
    const directorId = parseInt(req.params.id, 10);
    getDirector(req, res, directorId);
}));



router.post("/:id/movies-directed/add", csrfProtection, validateDirectedMovie, asyncHandler(async (req, res) => {
    const validatorErrors = validationResult(req);
    const directorId = parseInt(req.params.id, 10);
    if (!validatorErrors.isEmpty()) {
        const errors = validatorErrors.array().map((error) => error.msg);
        getDirector(req, res, directorId, errors);
    } else {
        const directorId = parseInt(req.params.id, 10);

        let {
            title,
            yearReleased,
            imageLink
        } = req.body;

        if (yearReleased === "--Year--") yearReleased = 0;

        await Movie.create({
            title,
            directorId,
            yearReleased,
            imageLink
        });

        res.redirect(`/directors/${directorId}`);
    }
}));


router.post("/:id/favorites/add", csrfProtection, validateFavoriteMovie, asyncHandler(async (req, res) => {
    const directorId = parseInt(req.params.id, 10);
    const validatorErrors = validationResult(req);
    if (!validatorErrors.isEmpty()) {
        const errors = validatorErrors.array().map((error) => error.msg);
        getDirector(req, res, directorId, errors);
    } else {
        let {
            title,
            movieSearchRes,
            directorName,
            yearReleased,
            imageLink
        } = req.body;

        if (yearReleased === "--Year--") yearReleased = 0;

        let movie;

        if (title) {
            let directorOfFavorite = await Director.findOne({ where: { name: directorName }});

            if (!directorOfFavorite) {
                directorOfFavorite = await Director.create({name: directorName});
            }

            movie = await Movie.create({
                title,
                directorId: directorOfFavorite.id,
                yearReleased,
                imageLink
            });
        } else {
            movie = await Movie.findOne({ where: { title: movieSearchRes } });
        }

        await DirectorFavorite.create({ director_Id: directorId, movieId: movie.id });

        res.redirect(`/directors/${directorId}`);
    }
}));


router.post("/:id/notes", csrfProtection, asyncHandler(async (req, res, next) => {
    const { userId } = req.session.auth;
    let { directorNotes } = req.body;
    const directorId = parseInt(req.params.id, 10);
    const favoriteDirector = await FavoriteDirector.findOne({ where: { userId, directorId }});
    await favoriteDirector.update({
        userId,
        directorId,
        notes: directorNotes });
    res.redirect("/");
}));


router.post("/:id/links", csrfProtection, asyncHandler(async (req, res, next) => {
    const { userId } = req.session.auth;
    let { linkText, linkUrl } = req.body;
    const directorId = parseInt(req.params.id, 10);

    await Link.create({
        userId,
        table: "Director",
        tableItemId: directorId,
        linkText,
        linkUrl
    });
    res.redirect("/");
}));


router.delete("/:id/favorites/:movieId", asyncHandler(async (req, res, next) => {
    const directorId = req.params.id;
    const movieId = req.params.movieId;

    const directorFav = await DirectorFavorite.findOne({ where: {
        director_Id: directorId,
        movieId
    } });

    await directorFav.destroy();
    res.json({ message: "Success" });
}));


router.delete("/:id", asyncHandler(async (req, res, next) => {
    const directorId = req.params.id;
    const director = await Director.findByPk(directorId);
    if (director) {
        await director.destroy();
        res.json({ message: "Success"})
    } else {
        console.log("Couldn't get director");
    }
}));


module.exports = router;

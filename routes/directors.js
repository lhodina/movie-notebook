const express = require("express");
const { check, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");
const { Director, Movie, DirectorFavorite } = db;
const { requireAuth } = require("../auth");

const router = express.Router();


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


router.post("/", validateDirector, csrfProtection, asyncHandler(async (req, res) => {
    const { name } = req.body;
    const director = await Director.create({
        name
    });
    res.redirect("/directors");
}));


router.get("/:id", csrfProtection, asyncHandler(async (req, res) => {
    const directorId = parseInt(req.params.id, 10);
    const director = await Director.findByPk(directorId);
    const directors = await Director.findAll();
    const movies = await Movie.findAll();
    const directedMovies = await Movie.findAll({ where: { directorId } });
    console.log("directedMovies:", directedMovies);

    const favoriteMovieIds = await DirectorFavorite.findAll({
        where: { director_Id: directorId }
    }).map((fav) => fav.dataValues.movie_Id);

    console.log("favoriteMovieIds:", favoriteMovieIds);

    const favoriteMovies = [];
    for (let favoriteMovieId of favoriteMovieIds) {
        const favoriteMovie = await Movie.findByPk(favoriteMovieId);
        favoriteMovies.push(favoriteMovie);
    }

    let years = [];
    let today = new Date().getFullYear();
    for (let i = 1888; i < today + 1; i++) {
        years.push(i);
    }

    console.log("years:", years);

    res.render("director", {
        director,
        directors,
        movies,
        directedMovies,
        favoriteMovies,
        years,
        csrfToken: req.csrfToken()
    });
}));


router.post("/:id/favorites/add", csrfProtection, asyncHandler(async (req, res) => {
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

    const current_director_id = parseInt(req.params.id, 10);

    const directorFavorite = await DirectorFavorite.create({
        director_Id: current_director_id,
        movie_Id: movie.id,
    });

    res.redirect(`/directors/${current_director_id}`);
}));


module.exports = router;

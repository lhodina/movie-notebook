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

const validateFavoriteMovie = [
    check("title")
        .exists({ checkFalsy: true })
        .withMessage("Please enter a movie title"),
    check("directorId")
        .exists({ checkFalsy: true })
        .withMessage("Please include a director")
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
    const directors = await Director.findAll();
    const movies = await Movie.findAll();

    const director = await Director.findByPk(directorId, {
        include: [
            'directedMovies',
            {
                model: Movie,
                as: 'directorFavorites',
                include: {model: Director, as: 'directorOfFavorite' }
            }
        ]
    });

    const directedMovies = director.dataValues.directedMovies;

    const favoriteMovieData = director.dataValues.directorFavorites;

    const favoriteMovies = favoriteMovieData.map(movieData => {
        const movie = movieData.dataValues;
        const director = movieData.dataValues.directorOfFavorite.dataValues.name;

        const cleanedMovie = {
            id: movie.id,
            title: movie.title,
            directorId: movie.directorId,
            director,
            yearReleased: movie.yearReleased,
            imageLink: movie.imageLink
        };

        return cleanedMovie;
    });

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



router.post("/:id/movies-directed/add", csrfProtection, validateDirectedMovie, asyncHandler(async (req, res) => {
    const validatorErrors = validationResult(req);

    if (!validatorErrors.isEmpty()) {
        const errors = validatorErrors.array().map((error) => error.msg);
        const directorId = parseInt(req.params.id, 10);
        const directors = await Director.findAll();
        const movies = await Movie.findAll();

        const director = await Director.findByPk(directorId, {
            include: [
                'directedMovies',
                {
                    model: Movie,
                    as: 'directorFavorites',
                    include: {model: Director, as: 'directorOfFavorite' }
                }
            ]
        });

        const directedMovies = director.dataValues.directedMovies;

        const favoriteMovieData = director.dataValues.directorFavorites;

        const favoriteMovies = favoriteMovieData.map(movieData => {
            const movie = movieData.dataValues;
            const director = movieData.dataValues.directorOfFavorite.dataValues.name;

            const cleanedMovie = {
                id: movie.id,
                title: movie.title,
                directorId: movie.directorId,
                director,
                yearReleased: movie.yearReleased,
                imageLink: movie.imageLink
            };

            return cleanedMovie;
        });

        res.render("director", {
            director,
            directors,
            movies,
            years,
            directedMovies,
            favoriteMovies,
            errors,
            csrfToken: req.csrfToken()
        });
    } else {
        const directorId = parseInt(req.params.id, 10);

        let {
            title,
            yearReleased,
            imageLink
        } = req.body;

        if (yearReleased === "--Year--") yearReleased = null;

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
    const currentDirectorId = parseInt(req.params.id, 10);
    const currentDirector = await Director.findByPk(currentDirectorId);

    const otherDirectorName = req.body.directorName;
    let otherDirector = await Director.findOne({ where: { name: otherDirectorName } });
    if (!otherDirector) {
        otherDirector = await Director.create({ name: otherDirectorName });
    }

    let {
        title,
        yearReleased,
        imageLink
    } = req.body;

    if (yearReleased === "--Year--") yearReleased = null;

    const { selectMovie } = req.body;
    let movie;
    if (selectMovie !== "--Choose Movie--") {
        movie = await Movie.findOne({ where: { title: selectMovie } });
    } else {
        movie = await Movie.create({
            title,
            directorId: otherDirector.id,
            yearReleased,
            imageLink
        });
    }

    await DirectorFavorite.create({
        director_Id: currentDirector.id,
        movieId: movie.id,
    });

    res.redirect(`/directors/${currentDirector.id}`);
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

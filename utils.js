const { validationResult } = require("express-validator");
const csrf= require("csurf");

const { User, Director, Critic } = require("./db/models");

const csrfProtection = csrf({ cookie: true });
const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);


const handleValidationErrors = (req, res, next) => {
    const validationErrors = validationResult(req);
    let errors = [];
    if (!validationErrors.isEmpty()) {
        errors = validationErrors.array().map((error) => error.msg);
        const err = Error("Bad request.");
        err.status = 400;
        err.title = "Bad request.";
        err.errors = errors;
        return next(err);
    }
    next();
};


const getYears = () => {
    let years = [];
    let today = new Date().getFullYear();
    for (let i = 1920; i < today + 1; i++) {
        years.push(i);
    }

    return years;
};


const getMovies = (movies, user="") => movies.map( (movieData) => {
    const data = movieData.dataValues;

    if (user) {
        const favoriteCritics = user.dataValues.Critics;
        const favoriteCriticNames = favoriteCritics.map(critic => critic.name);

        const critics = data.Critics.map(criticData => criticData.dataValues).filter(critic => favoriteCriticNames.includes(critic.name));
        const directors = data.favoritedByDirectors.map(directorData => directorData.dataValues);

        let cleanedMovie = {
            id: data.id,
            title: data.title,
            director: data.movieDirector.name,
            yearReleased: data.yearReleased,
            imageLink: data.imageLink,
            likedByDirectors: directors,
            likedByCritics: critics
        };

        const userNotes = data.UserNotes;
        let userNote;

        if (userNotes && userNotes.length) {
            userNote = userNotes[0].dataValues;
            cleanedMovie.review = userNote.review;
            cleanedMovie.rating = userNote.rating;
            cleanedMovie.watchedStatus = userNote.watchedStatus
        }
        return cleanedMovie;
    } else {
        return {
            id: data.id,
            title: data.title,
            director: data.movieDirector.name,
            yearReleased: data.yearReleased,
            imageLink: data.imageLink
        }
    }
});


module.exports = {
    csrfProtection,
    asyncHandler,
    handleValidationErrors,
    getYears,
    getMovies
};

const { validationResult } = require("express-validator");
const csrf= require("csurf");
const { Op } = require("sequelize");
const db = require("./db/models");
const { Director, Movie, FavoriteDirector, Critic, FavoriteCritic, UserNote, Collection, MovieCollection, Link } = db;

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
    years[0] = "--Year--"
    let today = new Date().getFullYear();
    for (let i = today; i > 1919; i--) {
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

        const favoriteDirectors = user.dataValues.Directors;
        const favoriteDirectorNames = favoriteDirectors.map(director => director.name);
        const directors = data.favoritedByDirectors.map(directorData => directorData.dataValues).filter(director => favoriteDirectorNames.includes(director.name));

        let cleanedMovie = {
            id: data.id,
            title: data.title,
            director: data.movieDirector.name,
            directorId: data.movieDirector.id,
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

        let recommendedScore = 0;

        const reasons = [];

        const directorLikes = cleanedMovie.likedByDirectors.length;
        recommendedScore += directorLikes;

        const criticLikes = cleanedMovie.likedByCritics.length;
        recommendedScore += criticLikes;

        const directedByFavorite = favoriteDirectorNames.includes(cleanedMovie.director);

        if (directedByFavorite) {
            recommendedScore++;
            reasons.push(` + Directed by one of your favorite directors: ${cleanedMovie.director}`);
        }

        if (cleanedMovie.watchedStatus === false) {
            recommendedScore += .5;
            reasons.push(" + You marked this movie Want to Watch");
        }

        if (cleanedMovie.likedByDirectors.length) {
            for (let director of cleanedMovie.likedByDirectors) {
                reasons.push(` + Liked by one of your favorite directors: ${director.name}`);
            }
        }

        if (cleanedMovie.likedByCritics.length) {
            for (let critic of cleanedMovie.likedByCritics) {
                reasons.push(` + Liked by one of your favorite critics: ${critic.name}`);
            }
        }

        cleanedMovie.recommendedScore = recommendedScore;
        cleanedMovie.reasons = reasons;

        return cleanedMovie;
    } else {
        return {
            id: data.id,
            title: data.title,
            director: data.movieDirector.name,
            directorId: data.movieDirector.id,
            yearReleased: data.yearReleased,
            imageLink: data.imageLink
        }
    }
});


const getDirector = async (req, res, directorId, errors) => {
    const { userId } = req.session.auth;

    const directors = await Director.findAll();
    const movies = await Movie.findAll();

    const director = await Director.findByPk(directorId, {
        include: [
            {
                model: Movie,
                as: 'directedMovies',
                include: [{ model: UserNote }]
            }
            ,
            {
                model: Movie,
                as: 'directorFavorites',
                include: [{ model: Director, as: 'directorOfFavorite' }, { model: UserNote }]
            }
        ]
    });

    const directedMovieData = director.dataValues.directedMovies;
    const directedMovies = directedMovieData.map(movieData => {
        const movie = movieData.dataValues;
        const userNotesData = movie.UserNotes;

        const cleanedMovie = {
            id: movie.id,
            title: movie.title,
            yearReleased: movie.yearReleased,
            imageLink: movie.imageLink
        };

        if (userNotesData.length) {
            const userNote = userNotesData[0].dataValues;
            cleanedMovie.review = userNote.review;
            cleanedMovie.rating = userNote.rating;
            cleanedMovie.watchedStatus = userNote.watchedStatus;
        }

        return cleanedMovie;
    });


    const favoriteMovieData = director.dataValues.directorFavorites;

    const favoriteMovies = favoriteMovieData.map(movieData => {
        const movie = movieData.dataValues;
        const director = movieData.dataValues.directorOfFavorite.dataValues.name;
        const userNotesData = movie.UserNotes;

        const cleanedMovie = {
            id: movie.id,
            title: movie.title,
            directorId: movie.directorId,
            director,
            yearReleased: movie.yearReleased,
            imageLink: movie.imageLink
        };

        if (userNotesData.length) {
            const userNote = userNotesData[0].dataValues;
            cleanedMovie.review = userNote.review;
            cleanedMovie.rating = userNote.rating;
            cleanedMovie.watchedStatus = userNote.watchedStatus;
        }

        return cleanedMovie;
    });

    let favoriteDirector = await FavoriteDirector.findOne({
        where: {
            [Op.and]: [
                { userId },
                { directorId }
            ]
        }
    });

    const links = await Link.findAll({
        where: {
            [Op.and]: [
                { userId },
                { table: "Director" },
                { tableItemId: director.id }
            ]

        }
    });

    const years = getYears();

    res.render("director", {
        director,
        favoriteDirector,
        directors,
        movies,
        years,
        directedMovies,
        favoriteMovies,
        links,
        errors,
        csrfToken: req.csrfToken()
    });
}


const getCritic = async (req, res, criticId, errors) => {
    const { userId } = req.session.auth;

    const movies = await Movie.findAll();
    const directors = await Director.findAll();

    const critic = await Critic.findByPk(criticId, {
        include: {
            model: Movie,
            include: [ { model: UserNote }, "movieDirector", "favoritedByDirectors" ]
        }
    });

    let favoriteCritic = await FavoriteCritic.findOne({
        where: {
            [Op.and]: [
                { userId },
                { criticId }
            ]
        }
    });

    const favoriteMovies = critic.dataValues.Movies.map(movieData => {
        const data = movieData.dataValues;
        const userNotesData = data.UserNotes;

        const movie = {
            id: data.id,
            title: data.title,
            director: data.movieDirector.name,
            yearReleased: data.yearReleased,
            imageLink: data.imageLink,
            favoritedByDirectors: data.favoritedByDirectors,
            likedByCritics: data.likedByCritics
        };

        if (userNotesData.length) {
            const userNote = userNotesData[0].dataValues;
            movie.review = userNote.review;
            movie.rating = userNote.rating;
            movie.watchedStatus = userNote.watchedStatus;
        }

        return movie;
    });

    const links = await Link.findAll({
        where: {
            [Op.and]: [
                { userId },
                { table: "Critic" },
                { tableItemId: critic.id }
            ]
        }
    });

    const years = getYears();

    res.render("critic", {
        critic,
        favoriteCritic,
        movies,
        directors,
        years,
        favoriteMovies,
        links,
        errors,
        csrfToken: req.csrfToken()
    });
}


const removeFromWantToWatch = async (movieId, watchedStatus) => {
    if (watchedStatus === "1") {
        const wantToWatch = await Collection.findOne({ where: { name: "Want to Watch" } });

        console.log('wantToWatch:', wantToWatch)
        if (wantToWatch) {
            const collectionId = wantToWatch.dataValues.id;

            const watchedMovie = await MovieCollection.findOne({ where: {
                [Op.and]: [
                    { movieId },
                    { collectionId }
                ]
            } });

            console.log('watchedMovie:', watchedMovie)

            if (watchedMovie) await watchedMovie.destroy();
        }
    }
}


module.exports = {
    csrfProtection,
    asyncHandler,
    handleValidationErrors,
    getYears,
    getMovies,
    getDirector,
    getCritic,
    removeFromWantToWatch
};

const express = require("express");
const { requireAuth } = require("../auth");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { environment } = require("../config");
const { User, Collection, Movie, MovieCollection, Director, FavoriteDirector, Critic, FavoriteCritic, UserNote } = require("../db/models");
const { asyncHandler, csrfProtection, getMovies } = require("../utils");

const router = express.Router();


router.get("/", asyncHandler(async (req, res) => {
    if (req.session.auth) {
        const { userId } = req.session.auth;

        const user = await User.findByPk(userId, {
            include:
                [
                    {
                        model: Director,
                        include: User
                    },
                    {
                        model: Critic,
                        include: User
                    }
                ]
        });

        const favoriteDirectors = user.dataValues.Directors;
        const favoriteCritics = user.dataValues.Critics;

        const allMovies = await Movie.findAll({
            include: [
                'movieDirector',
                'favoritedByDirectors',
                {
                    model: Critic,
                    include: { model: Movie }
                },
                { model: UserNote },
                { model: Collection }
            ]
        });

         const userMovies = getMovies(allMovies, user);

        if (userMovies.length) {
            const sortedRecs = userMovies.sort((a, b) => b.recommendedScore - a.recommendedScore);
            const mostRecommended = sortedRecs.filter(rec => rec.recommendedScore > 1);


            let recommendationsCollection = await Collection.findOne({ where: {name: "Most Recommended"} });

            if (!recommendationsCollection) {
                recommendationsCollection = await Collection.create({
                    name: "Most Recommended",
                    userId: user.id
                });
            }

            const recsId = recommendationsCollection.id;

            const recommended = await MovieCollection.findAll({where: { collectionId: recsId} });

            const alreadyRecommended = recommended.map(rec => rec.dataValues.movieId);

            const buildRecsCollection = mostRecommended.map(rec => {
               return {
                    movieId: rec.id,
                    collectionId: recsId
                }
            }).filter(each => !alreadyRecommended.includes(each.movieId));

            if (buildRecsCollection) {
                await MovieCollection.bulkCreate(buildRecsCollection);
            }


            let wantToWatchCollection = await Collection.findOne({ where: {name: "Want to Watch"} });

            if (!wantToWatchCollection) {
                wantToWatchCollection = await Collection.create({
                    name: "Want to Watch",
                    userId: user.id
                });
            }

            const wantToWatchId = wantToWatchCollection.id;

            const wantToWatch = userMovies.filter(movie => movie.watchedStatus === false);

            const toWatch = await MovieCollection.findAll({where: { collectionId: wantToWatchId}})

            const alreadyWantToWatch = toWatch.map(watched => watched.dataValues.movieId);

            const buildWantToWatch = wantToWatch.map(toWatch => {
                return {
                    movieId: toWatch.id,
                    collectionId: wantToWatchId
                }
            }).filter(each => !alreadyWantToWatch.includes(each.movieId));

            if (buildWantToWatch) {
                await MovieCollection.bulkCreate(buildWantToWatch);
            }
    }


        const collections = await Collection.findAll({
            where: { userId },
            include:
                {
                    model: Movie,
                    include: [
                        'movieDirector',
                        'favoritedByDirectors',
                        {
                            model: Critic,
                            include: { model: Movie }
                        },
                        { model: UserNote }
                    ]
                }
        }).map((collectionData) => {
            const collection = collectionData.dataValues;
            const collectionName = collection.name;
            const movieList = getMovies(collection.Movies, user);
            let movies;

            if (collectionName === "Most Recommended") {
                const sortedRecs = movieList.sort((a, b) => b.recommendedScore - a.recommendedScore);
                movies = sortedRecs.filter(rec => rec.recommendedScore > 0);
            } else {
                movies = movieList;
            }

            const displayShelf = {
                id: collection.id,
                name: collectionName,
                movies
            }
            return displayShelf;
        });

        res.render("user-home", {
            collections,
            favoriteDirectors,
            favoriteCritics
        });
    } else {
        res.render("index", {
            title: "MOVIE NOTEBOOK",
        });
    }
}));


router.get("/favorite-directors/add", csrfProtection, requireAuth, asyncHandler(async (req, res) => {
    const directors = await Director.findAll();
    res.render("favorite-director-add", {
        directors,
        csrfToken: req.csrfToken()
    });
}));


router.post("/favorite-directors/add", csrfProtection, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const { directorName } = req.body;
    const favoriteDirectorsData = await FavoriteDirector.findAll({ where: userId });
    const favoriteDirectorIds = favoriteDirectorsData.map(director => director.dataValues.directorId);

    let director = await Director.findOne({ where: { name: directorName } });
    if (!director) {
        director = await Director.create({
            name: directorName
        });
    }

    if (!favoriteDirectorIds.includes(director.id)) {
        await FavoriteDirector.create({
            userId,
            directorId: director.id
        });

        res.redirect("/");
    } else {
        const directors = await Director.findAll();
        const errorMessage = `${directorName} is already one of your favorite directors!`;
        res.render("favorite-director-add", {
            directors,
            errorMessage,
            csrfToken: req.csrfToken()
        });
    }
}));


router.get("/favorite-critics/add", csrfProtection, requireAuth, asyncHandler(async (req, res) => {
    const critics = await Critic.findAll();
    res.render("favorite-critic-add", {
        critics,
        csrfToken: req.csrfToken()
    });
}));


router.post("/favorite-critics/add", csrfProtection, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth;
    const { criticName } = req.body;
    const favoriteCriticsData = await FavoriteCritic.findAll({ where: userId });
    const favoriteCriticIds = favoriteCriticsData.map(critic => critic.dataValues.criticId);

    let critic = await Critic.findOne({ where: { name: criticName } });
    if (!critic) {
        critic = await Critic.create({
            name: criticName
        });
    }

    if (!favoriteCriticIds.includes(critic.id)) {
        await FavoriteCritic.create({
            userId,
            criticId: critic.id
        });
    } else {
        const critics = await Critic.findAll();
        const errorMessage = `${criticName} is already one of your favorite critics!`;
        res.render("favorite-critic-add", {
            critics,
            errorMessage,
            csrfToken: req.csrfToken()
        });
    }
}));


router.get("/search", asyncHandler(async (req, res) => {
    console.log("req.query:", req.query);
    const { q } = req.query;
    console.log("q:", q);

    let movies = await Movie.findAll({ where: { title: { [Op.like]: "%" + q + "%" } } });
    console.log("movies:", movies);

    const searchResults = movies.map(data => data.dataValues.title);
    res.render("layout", {
        searchResults
    });
}));



if (environment !== "production") {
    router.get("/error-test", () => {
        throw new Error("TEST ERROR...");
    });
}


module.exports = router;

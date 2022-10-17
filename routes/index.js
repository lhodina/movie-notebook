const express = require("express");
const { requireAuth } = require("../auth");
const { check, validationResult } = require("express-validator");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { environment } = require("../config");
const { User, Collection, Movie, MovieCollection, Director, Critic, UserNote } = require("../db/models");
const { asyncHandler, csrfProtection, getMovies } = require("../utils");

const router = express.Router();


router.get("/", csrfProtection, asyncHandler(async (req, res) => {
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
        res.render("login", {
            csrfToken: req.csrfToken()
        });
    }
}));


router.get("/search/:value", asyncHandler(async (req, res) => {
    let val = req.params.value.toLowerCase();
    const { q } = req.query;

    const movies = await Movie.findAll({ where: {
        title: {
            [Op.iLike]: "%" + val + "%"
        }
    }
    });

    const directors = await Director.findAll({ where: {
        name: {
            [Op.iLike]: "%" + val + "%"
        }
    }
    });

    const critics = await Critic.findAll({ where: {
        name: {
            [Op.iLike]: "%" + val + "%"
        }
    }
    });

    const collections = await Collection.findAll({ where: {
        name: {
            [Op.iLike]: "%" + val + "%"
        }
    }
    });

    const movieResults = movies.map(data => data.dataValues);
    const directorResults = directors.map(data => data.dataValues);
    const criticResults = critics.map(data => data.dataValues);
    const collectionResults = collections.map(data => data.dataValues);

    res.json({
        movieResults,
        directorResults,
        criticResults,
        collectionResults
     });
}));



if (environment !== "production") {
    router.get("/error-test", () => {
        throw new Error("TEST ERROR...");
    });
}


module.exports = router;

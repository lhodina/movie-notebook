const express = require("express");
const { requireAuth } = require("../auth");

const { environment } = require("../config");
const { User, Collection, Movie, Director, FavoriteDirector, Critic, FavoriteCritic, UserNote } = require("../db/models");
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

            const movies = getMovies(collection.Movies, user);

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
    let director = await Director.findOne({ where: { name: directorName } });
    if (!director) {
        director = await Director.create({
            name: directorName
        });
    }

    await FavoriteDirector.create({
        userId,
        directorId: director.id
    });

    res.redirect("/");
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
    let critic = await Critic.findOne({ where: { name: criticName } });
    if (!critic) {
        critic = await Critic.create({
            name: criticName
        });
    }

    await FavoriteCritic.create({
        userId,
        criticId: critic.id
    });

    res.redirect("/");
}));



if (environment !== "production") {
    router.get("/error-test", () => {
        throw new Error("TEST ERROR...");
    });
}


module.exports = router;

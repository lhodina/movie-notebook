const express = require("express");

const { environment } = require("../config");
const { Collection, Movie, Director } = require("../db/models");
const { asyncHandler } = require("../utils");

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
    if (req.session.auth) {
        const { userId } = req.session.auth;

        const collections = await Collection.findAll({
            where: { user_Id: userId },
            include: {
                model: Movie,
                include: Director
            }
        }).map(collectionData => {
            const collection = collectionData.dataValues;
            const collectionName = collection.name;
            const movies = collection.Movies.map( movieData => {
                const data = movieData.dataValues;
                let cleanedMovie = {
                    title: data.title,
                    director: data.Director.name,
                    yearReleased: data.yearReleased,
                    imageLink: data.imageLink
                };

                return cleanedMovie;
            });

            const displayShelf = {
                name: collectionName,
                movies
            }
            return displayShelf;
        });



        res.render("user-home", {
            collections
        });
    } else {
        res.render("index", {
            title: "MOVIE NOTEBOOK",
        });
    }
}));

if (environment !== "production") {
    router.get("/error-test", () => {
        throw new Error("TEST ERROR...");
    });
}


module.exports = router;

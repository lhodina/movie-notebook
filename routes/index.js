const express = require("express");

const { environment } = require("../config");
const { User, Collection, Movie, MovieCollection, Director } = require("../db/models");
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
        })


        // const collections = await Collection.findAll({
        //     where: { user_Id: userId },
        //     include: {
        //         model: Movie,
        //         include: Director
        //     }
        // }).map(collectionData => {
        //     const collection = collectionData.dataValues;
        //     const collectionName = collection.name;
        //     const movies = collection.Movies.map( movieData => {
        //         const data = movieData.dataValues;
        //         let cleanedMovie = {
        //             title: data.title,
        //             directorId: data.directorId,
        //             yearReleased: data.yearReleased,
        //             imageLink: data.imageLink
        //         };

        //         return cleanedMovie;
        //     });

        //     const displayShelf = {
        //         name: collectionName,
        //         movies
        //     }
        //     return displayShelf;
        // });

        console.log("*****collections:", collections);
        for (let collection of collections) {
            console.log("*****collection.dataValues.name:", collection.dataValues.name);
            console.log("*****collection.datavalues.Movies:", collection.dataValues.Movies);
            const movies = collection.dataValues.Movies;
            for (let movie of movies) {
                console.log("movie.Director:", movie.Director);
            }
        }

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

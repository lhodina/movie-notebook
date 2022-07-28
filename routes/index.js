const express = require("express");

const { environment } = require("../config");
const { User, Collection, Movie, MovieCollection } = require("../db/models");
const { asyncHandler } = require("../utils");

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
    if (req.session.auth) {
        const { userId } = req.session.auth;

        const collections = await Collection.findAll({
            where: { user_Id: userId },
            include: Movie
        }).map(collectionData => {
            const collection = collectionData.dataValues;
            const collectionName = collection.name;
            const movies = collection.Movies.map(movieData => {
                const data = movieData.dataValues;
                const cleanedMovie = {
                    title: data.title,
                    directorId: data.directorId,
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

        console.log("*****collections:", collections);
        for (let collection of collections) {
            console.log(collection.name);
            console.log(collection.movies);
        }

        // for (let collection of collections) {
        //     console.log("*****collection.name:", collection.name);
        //     console.log("*****collection.Movies:", collection.Movies);
        //     for (let movie of collection.Movies) {
        //         console.log("*****movie.dataValues:", movie.dataValues);
        //     }
        // }


        // // const shelfDisplay = {
        // //     collection name,
                    // array of movie objects
        // //
        //             title,
        //             director,
        //             year released
        //             image,


        // // }


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

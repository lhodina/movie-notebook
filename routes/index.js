const express = require("express");

const { environment } = require("../config");
const { User, Collection, Movie, MovieCollection } = require("../db/models");
const { asyncHandler } = require("../utils");

const router = express.Router();

router.get("/", asyncHandler(async (req, res) => {
    if (req.session.auth) {
        const { userId } = req.session.auth;

        const collections = await Collection.findAll({include: [
                {
                    model: User,
                    where: { id: userId }
                },
                {
                    model: Movie,
                    through: MovieCollection
                }
        ]});

        console.log("collections:", collections);

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

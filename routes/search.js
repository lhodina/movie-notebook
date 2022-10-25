const express = require("express");
const router = express.Router();

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { Collection, Movie, Director, Critic } = require("../db/models");

const { asyncHandler } = require("../utils");


router.get("/:value/", asyncHandler(async (req, res) => {
    let val = req.params.value.toLowerCase();
    const location = req.params.location;
    console.log("val:", val);
    console.log("location:", location);

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


module.exports = router;

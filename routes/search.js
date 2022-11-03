const express = require("express");
const router = express.Router();

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const { Collection, Movie, Director, Critic } = require("../db/models");

const { asyncHandler } = require("../utils");


router.get("/:value", asyncHandler(async (req, res) => {
    const val = req.params.value.toLowerCase();

    const collections = await Collection.findAll({ where: {
        name: {
            [Op.iLike]: "%" + val + "%"
        }
    }
    });

    const collectionResults = collections.map(data => data.dataValues);

    const movies = await Movie.findAll({ where: {
        title: {
            [Op.iLike]: "%" + val + "%"
        }
    }
    });

    const movieResults = movies.map(data => data.dataValues);

    const directors = await Director.findAll({ where: {
        name: {
            [Op.iLike]: "%" + val + "%"
        }
    }
    });

    const directorResults = directors.map(data => data.dataValues);

    const critics = await Critic.findAll({ where: {
        name: {
            [Op.iLike]: "%" + val + "%"
        }
    }
    });

    const criticResults = critics.map(data => data.dataValues);

    res.json({
        collectionResults,
        movieResults,
        directorResults,
        criticResults
    });
}));


module.exports = router;

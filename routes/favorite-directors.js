const express = require("express");
const { requireAuth } = require("../auth");
const { check, validationResult } = require("express-validator");
const db = require("../db/models");
const {  Director, FavoriteDirector, Link } = db;
const { asyncHandler, csrfProtection } = require("../utils");

const router = express.Router();

const validateFavoriteDirector = [
    check("directorName")
        .exists({ checkFalsy: true })
        .withMessage("Please enter a favorite director name")
];


router.get("/add", csrfProtection, asyncHandler(async (req, res) => {
    const directors = await Director.findAll();
    res.render("favorite-director-add", {
        directors,
        csrfToken: req.csrfToken()
    });
}));


router.post("/add", csrfProtection, validateFavoriteDirector, asyncHandler(async (req, res) => {
    const validatorErrors = validationResult(req);

    if (!validatorErrors.isEmpty()) {
        const errors = validatorErrors.array().map((error) => error.msg);
        const directors = await Director.findAll();
        res.render("favorite-director-add", {
            directors,
            errors,
            csrfToken: req.csrfToken()
        });
    } else {
        const { userId } = req.session.auth;
        const { directorName, directorNotes } = req.body;
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
                directorId: director.id,
                notes: directorNotes
            });
            res.redirect("/");
        } else {
            const directors = await Director.findAll();
            const errors = [`${directorName} is already one of your favorite directors!`];
            res.render("favorite-director-add", {
                directors,
                errors,
                csrfToken: req.csrfToken()
            });
        }
    }
}));


module.exports = router;

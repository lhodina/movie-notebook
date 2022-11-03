const express = require("express");
const { requireAuth } = require("../auth");
const { check, validationResult } = require("express-validator");

const {  Critic, FavoriteCritic, Link } = require("../db/models");
const { asyncHandler, csrfProtection } = require("../utils");

const router = express.Router();

const validateFavoriteCritic = [
    check("name")
        .exists({ checkFalsy: true })
        .withMessage("Please enter a favorite critic name")
];


router.get("/add", csrfProtection, asyncHandler(async (req, res) => {
    const critics = await Critic.findAll();
    res.render("favorite-critic-add", {
        critics,
        csrfToken: req.csrfToken()
    });
}));


router.post("/add", csrfProtection, validateFavoriteCritic, asyncHandler(async (req, res) => {
    const validatorErrors = validationResult(req);

    if (!validatorErrors.isEmpty()) {
        const errors = validatorErrors.array().map((error) => error.msg);
        const critics = await Critic.findAll();
        res.render("favorite-critic-add", {
            critics,
            errors,
            csrfToken: req.csrfToken()
        });
    } else {
        const { userId } = req.session.auth;
        const { name, criticNotes, linkText, linkUrl } = req.body;
        const favoriteCriticsData = await FavoriteCritic.findAll({ where: userId });
        const favoriteCriticIds = favoriteCriticsData.map(critic => critic.dataValues.criticId);

        let critic = await Critic.findOne({ where: { name } });
        if (!critic) {
            critic = await Critic.create({
                name
            });
        }

        if (!favoriteCriticIds.includes(critic.id)) {
            await FavoriteCritic.create({
                userId,
                criticId: critic.id,
                criticNotes
            });

            if (linkText && linkUrl) {
                await Link.create({
                    userId,
                    table: "Critic",
                    tableItemId: critic.id,
                    linkText,
                    linkUrl
                });
            }
        } else {
            const critics = await Critic.findAll();
            const errors = [`${name} is already one of your favorite critics!`];
            res.render("favorite-critic-add", {
                critics,
                errors,
                csrfToken: req.csrfToken()
            });
        }

        res.redirect(`/`);
    }
}));


module.exports = router;

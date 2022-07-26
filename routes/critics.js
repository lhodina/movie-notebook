const express = require("express");
const { check, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");
const { Critic, Movie } = db;
const { requireAuth } = require("../auth");

const router = express.Router();


router.get("/", asyncHandler(async (req, res) => {
    const critics = await Critic.findAll();
    res.render("critics", {
        critics
    });
}));


router.get("/add", csrfProtection, asyncHandler(async (req, res) => {
    res.render("critic-add", {
        csrfToken: req.csrfToken()
    });
}));


router.post("/add", csrfProtection, asyncHandler(async (req, res) => {
    const { name } = req.body;
    const critic = await Critic.create({ name });
    res.redirect("/critics")
}));


module.exports = router;

const express = require("express");
const { check, validationResult } = require("express-validator");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");
const { Director } = db;
const { requireAuth } = require("../auth");

const router = express.Router();


const validateDirector = [
    check("name")
        .exists({ checkFalsy: true })
        .withMessage("Please enter a director name"),
];


router.get("/", async (req, res) => {
    const directors = await Director.findAll();
    if (directors) {
        res.send(directors);
    } else {
        res.send("Directors coming soon...");
    }
});


router.get("/add", csrfProtection, asyncHandler(async (req, res) => {
    res.render("director-add", {
        csrfToken: req.csrfToken()
    });
}));


router.post("/", validateDirector, csrfProtection, asyncHandler(async (req, res) => {
    const { name } = req.body;
    const director = await Director.create({
        name
    });
    res.redirect("/directors");
}));


module.exports = router;

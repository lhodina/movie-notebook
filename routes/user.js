const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const { csrfProtection, asyncHandler, handleValidationErrors } = require("../utils");
const db = require("../db/models");
const { loginUser } = require("../auth");
const { User } = db;

const router = express.Router();


const validateUser = [
    check("username")
        .exists({ checkFalsy: true })
        .withMessage("Please enter a username"),
    check("email")
        .exists({ checkFalsy: true })
        .withMessage("Please enter your email address")
        .isEmail()
        .withMessage("Please enter a valid email."),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please enter a password")
];


router.get("/", (req, res) => {
    res.send("Howdy from user router");
});


router.get("/register", csrfProtection, asyncHandler(async (req, res) => {
    const user = User.build();
    res.render("register", {
        title: "Register",
        user,
        csrfToken: req.csrfToken()
    });
}));


router.post("/register", csrfProtection, validateUser, asyncHandler(async (req, res) => {
    const {
        username,
        email,
        password
    } = req.body;

    console.log("req.body:", req.body);

    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            hashedPassword
        });

        loginUser(req, res, next);
        res.redirect("/");
    } else {
        const errors = validatorErrors.array().map((error) => error.msg);
        res.render("register", {
            title: "Register",
            user,
            errors,
            csrfToken: req.csrfToken()
        });
    }
}));


// YOU NAMED THE PAGE "user/login" IN THE AUTH
// router.get("/login")


module.exports = router;

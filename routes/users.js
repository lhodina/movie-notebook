const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const { csrfProtection, asyncHandler } = require("../utils");
const db = require("../db/models");
const { User } = db;
const { loginUser, logoutUser } = require("../auth");

const router = express.Router();


const validateRegistration = [
    check("username")
        .exists({ checkFalsy: true })
        .withMessage("Please enter a username"),
    check("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Please enter a valid email."),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please enter a password")
];


const validateLogin = [
    check("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Please enter a valid email."),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please enter a password")
];


router.get("/", (req, res) => {
    res.send("Howdy from users router");
});


router.get("/register", csrfProtection, asyncHandler(async (req, res) => {
    const user = User.build();
    res.render("register", {
        title: "Register",
        user,
        csrfToken: req.csrfToken()
    });
}));


router.post("/register", csrfProtection, validateRegistration, asyncHandler(async (req, res) => {
    const {
        username,
        email,
        password
    } = req.body;

    const user = User.build({
        username,
        email
    });

    const validatorErrors = validationResult(req);

    if (validatorErrors.isEmpty()) {
        const hashedPassword = await bcrypt.hash(password, 10);

        user.hashedPassword = hashedPassword;
        await user.save();
        loginUser(req, res, user);
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


router.get("/login", csrfProtection, (req, res) => {
    res.render("login", {
        title: "Login",
        csrfToken: req.csrfToken()
    });
});


router.post("/login", csrfProtection, validateLogin, asyncHandler(async (req, res) => {
    const {
        email,
        password
    } = req.body;

    let errors = [];

    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
        const user = await User.findOne({ where: { email }});

        if (user !== null) {
            const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());
            if (passwordMatch) {
                loginUser(req, res, user);
                return res.redirect("/");
            }
        }

        errors.push("Invalid email or password");
    } else {
        errors = validatorErrors.array().map((error) => error.msg);
    }

    res.render("login", {
        title: "Login",
        email,
        errors,
        csrfToken: req.csrfToken()
    });
}));


router.post("/logout", (req, res) => {
    logoutUser(req, res);
    res.redirect("/users/login");
});


module.exports = router;

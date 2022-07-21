const express = require("express");
const { check } = require("express-validator");
const bcrypt = require("bcryptjs");

const { asyncHandler, handleValidationErrors } = require("../utils");
const db = require("../db/models");
const { User } = db;
const { getToken } = require("../auth");

const router = express.Router();

const validateUser = [
    check("username")
        .exists({ checkFalsy: true })
        .withMessage("Please enter a username"),
    check("email")
        .exists({ checkFalsy: true})
        .withMessage("Please enter your email address")
        .isEmail()
        .withMessage("Please enter a valid email."),
    check("password")
        .exists({ checkFalsy: true })
        .withMessage("Please enter a password")
];


router.get("/", (req, res) => {
    res.send("Howdy from users router");
});


router.post("/", validateUser, handleValidationErrors, asyncHandler(async (req, res) => {
    const {
        username,
        email,
        password
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        hashedPassword
    });

    const token = getToken(user);
    
    res.status(201).json({
        user: { id: user.id},
        token
    });
}));



module.exports = router;

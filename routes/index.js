const express = require("express");

const { environment } = require("../config");
const { User } = require("../db/models");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", {
        title: "MOVIE NOTEBOOK",
    });
});

if (environment !== "production") {
    router.get("/error-test", () => {
        throw new Error("TEST ERROR...");
    });
}


module.exports = router;

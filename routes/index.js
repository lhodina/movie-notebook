const express = require("express");
const { environment } = require("../config");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", {
        title: "INT. MOVIE NOTEBOOK OFFICES -- DAY"
    });
});

if (environment !== "production") {
    router.get("/error-test", () => {
        throw new Error("TEST ERROR...");
    });
}


module.exports = router;

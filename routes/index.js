const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.render("index", {
        title: "Splish-splash Page"
    });
});


module.exports = router;

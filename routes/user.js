const express = require('express');

const { asyncHandler, handleValidationErrors } = require("../utils");

const router = express.Router();

router.get("/", (req, res) => {
    res.send("Howdy from users router");
});


module.exports = router;

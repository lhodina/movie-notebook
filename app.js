const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const { environment } = require("./config");

const app = express();

app.use(morgan("dev"));
app.use(express.json());


module.exports = app;

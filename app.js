const express = require("express");
const morgan = require("morgan");

const { environment } = require("./config");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/user");

const app = express();

app.set("view engine", "pug");

app.use(morgan("dev"));
app.use(express.json());

app.use("/", indexRouter)
app.use("/users", usersRouter);


app.use((err, req, res, next) => {
    res.status(err.status || 500);
    const isProduction = environment === "production";
    res.json({
        title: err.title || "Server Error",
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});


module.exports = app;

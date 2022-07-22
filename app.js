const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const { environment, sessionSecret } = require("./config");

// RESTORE USER ONCE AUTH IS ADDED

const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/user");

const app = express();

app.set("view engine", "pug");

app.use(morgan("dev"));
app.use(cookieParser(sessionSecret));

app.use(session({
    name: 'movie-notebook.sid',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false
}));

app.use(express.urlencoded({ extended: false }));

// USE RESTORE USER ONCE AUTH ADDED

app.use("/", indexRoutes)
app.use("/user", userRoutes);


app.use((req, res, next) => {
    const err = new Error("The Requested page could not be found");
    err.status = 404;
    next(err);
});


app.use((err, req, res, next) => {
    if (environment === 'production' || environment === 'test') {
        // LOG ERROR TO DATABASE
    } else {
        console.error(err);
    }
    next(err);
});


app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404);
        res.render("page-not-found", {
            title: "Page Not Found"
        });
    } else {
        next(err);
    }
});


app.use((err, req, res, next) => {
    res.status(err.status || 500);
    const isProduction = environment === "production";
    res.render("error", {
        title: "Server Error",
        message: isProduction ? null : err.message,
        stack: isProduction ? null : err.stack
    });
});


module.exports = app;

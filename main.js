var logger = require("morgan"); // log library
var express = require("express");
var app = express();
require("dotenv").config(); //module that loads enviroment from .env file for secrets like port or api in future work

app.use(logger("dev")); //logger

const port = process.env.PORT || "3000";

const mp4_create = require("./routes/mp4create");

app.use(express.json()); // parse application/json
//#region cookie middleware for future work maybe ...
app.use(function (req, res, next) {

    next();

});
//#endregion


// just test if server on Air
app.get("/alive", (req, res) => res.send("I'm alive"));

// Routings
app.use("/mp4create", mp4_create);


app.use(function (err, req, res, next) {
    console.error(err);
    res.status(err.status || 500).send(err.message);
});

const server = app.listen(port, () => {
    console.log(`Server listen on port ${port}`);
});

module.exports = app;
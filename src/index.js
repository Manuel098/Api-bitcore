const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require('morgan');
const app = express();

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

mongoose
    .connect(
        'mongodb://localhost:27017/BitCore',
        {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }
    )
    .then(() => {
        console.log("Ingrese a la base de datos!");
    })
    .catch(error => {
        console.log(error);
    });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use('/api/chat', chatRoute);
// app.use('/api/users', usersRoute);
// app.use('/api/board', boardRoute);
// app.use('/api/profile', profileRoute);
// app.use('/api/contact', contactRoute);

module.exports = app;

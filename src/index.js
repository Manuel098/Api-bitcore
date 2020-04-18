const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const app = express();

const routeMongoDB = 'mongodb://localhost:27017/BitCore';

// Routes
const userRoute = require('./routes/user_route');
const monederoRoute = require('./routes/monedero_route');
const blockRoute = require('./routes/blockChain-route');

app.use(morgan('dev'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, PUT, DELETE, OPTIONS'
    );
    next();
});

mongoose
    .connect(
        routeMongoDB, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }
    )
    .then(() => {
        console.log('Ingrese a la base de datos!');
    })
    .catch(error => {
        console.log(error);
    });

mongoose.set('useFindAndModify', false);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/user',userRoute);
app.use('/api/monedero',monederoRoute);
app.use('/api/block',blockRoute);

module.exports = app;

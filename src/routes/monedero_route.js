const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../models/user_model');
const Monedero = require('../models/monedero_model');
const checkAuth = require('../../midleware/check-auth');

router.put('/comp', (req, res, next) => {
    Monedero.findOne({ _id: req.body._id }).then(wallet => {
        try {
            wallet['Historial'][0]['compra'].push([
                req.body['cant'],
                new Date()
            ]);
            Monedero.findOneAndUpdate({ _id: req.body._id }, { Historial: wallet['Historial'] }).then(asd => {
                res.status(200).json({
                    wall: asd
                });
            });
        }
        catch (error) {
            res.status(501).json({
                message: 'Strange error'
            });
            console.log(error);
        }
    }).catch(error => {
        console.log(error);
        res.status(501).json({
            message: 'Error from server'
        });
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');


const Users = require('../models/user_model');
const Monedero = require('../models/monedero_model');
const checkAuth =require('../../midleware/check-auth');

const globalToken = 'bitcore_nE';

// Get all users
router.get('', checkAuth, (req, res) => {
    userQuery = Users.find();
    userQuery.then(patients => {
        try {
            res.status(201).json({
                message: 'patients received',
                patients: patients
            });
        }
        catch(error){
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

// signup users.
router.post('/signUp', (req, res) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const User = new Users({
            user: req.body.user,
            email: req.body.email,
            password: hash,
        });
        const Mon = new Monedero({
            Historial: {
                venta:[],
                compra:[]
            },
            cantidad:0,
            userId:User['_id'],
        });
        console.log(User);
        Mon.save();
        User.save().then(User => {
            const token = jwt.sign(
                { email: User['email'], userId: User['_id'] },
                globalToken,
                { expiresIn: "1h" }
            );
            res.status(201).json({
                message: 'Genero Usuario!',
                token: token,
                user: User,
                Monedero: Mon,
                expiresIn: 3600
            });
        }).catch(error => {
            console.log(error);
            res.status(502).json({
                message: 'Usuario o correo ya existentes'
            });
        });
    }).catch(error => {
        console.log(error);
        res.status(502).json({
            message: 'Error'
        });
    });
});

// SignIn user
router.post('/signIn', (req, res) => {
    let fetchedUser, getMon;
    Users.findOne({ email: req.body.email }).then(user => {
        if (!user)
            return res.status(501).json({
                message: 'Error al iniciar sesión Compruebe usuario y contraseña'
            });
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
        if (!result) {
            return res.status(501).json({
                message: 'Error al iniciar sesión Compruebe usuario y contraseña'
            });
        }
        Monedero.findOne({userId: fetchedUser['_id']}).then(data =>{
            getMon = data;
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id },
                globalToken,
                { expiresIn: "1h" }
            );
            res.status(200).json({
                message: 'Bienvenido!',
                token: token,
                user: fetchedUser,
                Monedero: getMon,
                expiresIn: 3600,
            });
        });
    })
    .catch(err => {
        return res.status(501).json({
            message: "Credenciales invalidas"
        });
    });
});

module.exports = router;

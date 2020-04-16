const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');

const Users = require('../models/user_model');
const Monedero = require('../models/monedero_model');
const checkAuth =require('../../midleware/check-auth');

router.get('',(req,res,next)=>{

});

module.exports = router;

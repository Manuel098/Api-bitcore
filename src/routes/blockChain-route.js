const express = require('express');
const router = express.Router();
const request = require('request');

const checkAuth =require('../../midleware/check-auth');

request({
    url:'https://blockchain.info/stats?format=json',
    json: true
}, function(error, response, body){
    if(error){
        console.log(error);
    }else{
        btcData = body;
    }
});

router.get('', (req, res) => {
    try {
        res.status(201).json({
            btcData: btcData
        });
    }
    catch(error){
        res.status(501).json({
            message: 'Strange error: '+ error
        });
        console.log(error);
    }
});

module.exports = router;

var express = require('express');
var router = express.Router();
var dbConnect=require('../dbconfig/db-connect');
var passport=require('passport')
var user=require('../models/user')
var dbconfig = require('../dbconfig/db-connect');


/* GET home page. */
router.get('/', function(req, res, next) {
    dbConnect.get().collection('product').find().toArray(function (err, docs) {
        res.render('shop/index', {title: 'gameshoppie', products: docs});

    });

    });




router.get('/user/signup',function (req,res,next) {
    res.render('user/signup')
});

router.post('/user/signup',function (req,res,next) {
    res.redirect('/')
});


module.exports = router;

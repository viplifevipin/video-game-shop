var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var  {check,validationResult}=require('express-validator')
let ObjectID = require('mongodb').ObjectID;
var cart=require('../cart/cart');
var dbConnect = require('../dbconfig/db-connect');


router.get('/profile',isLoggedIn, function (req,res) {

    dbConnect.get().collection('orders').findOne({user:req.user},function(err,orders){
        if (err){
            return res.write('error')
        }
        var cart;
        console.log(orders)

            res.render('user/profile',{orders:req.orders});
        });
});

router.get('/logout',isLoggedIn,function (req,res,next) {
    req.logOut();
    res.redirect('/')
})

router.use('/',notLoggedIn,function (req,res,next) {
    next();
})

router.get('/signup',function (req,res) {
    var message = req.flash('error');
    res.render('user/signup',{message:message,hasError:message.length>0});
});

router.get('/signin',function (req,res) {
    var message = req.flash('error');
    res.render('user/signin',{message:message,hasError:message.length>0});
});


router.post('/signup',[check('email','Invalid email').isEmail(),check('password','Invalid password.').isLength({min:5})]
    ,passport.authenticate('local-signUp',  {
    failureRedirect:'/user/signup',
    failureFlash:true
}),function(req,res,next){
    if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    }
    else {
        res.render('user/profile')
    }
});



router.post('/signin',[check('email','Invalid email').isEmail(),check('password','Invalid password.').isLength({min:5})],passport.authenticate('local.signIn',  {



    failureRedirect:'/user/signin',
    failureFlash:true
}),function(req,res,next){
    if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    }
    else {
        res.render('user/profile')
    }
});



function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req,res,next){
    if(!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}



module.exports = router;


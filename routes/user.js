var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var passport = require('passport');
var  {check,validationResult}=require('express-validator')


var dbconfig = require('../dbconfig/db-connect');


router.get('/profile',isLoggedIn, function (req,res) {
    res.render('user/profile');
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
    ,passport.authenticate('auth.strategy',  {



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



router.post('/signin',[check('email','Invalid email').isEmail(),check('password','Invalid password.')],passport.authenticate('auth.strategy',  {



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


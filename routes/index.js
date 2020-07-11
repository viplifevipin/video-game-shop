var express = require('express');
var router = express.Router();
var dbConnect=require('../dbconfig/db-connect');
var passport=require('passport');
let ObjectID = require('mongodb').ObjectID;
var Cart=require('../cart/cart');



/* GET home page. */
router.get('/', function(req, res, next) {
    var successMsg=req.flash('success')[0];
    dbConnect.get().collection('product').find().toArray(function (err, docs) {
        res.render('shop/index', {title: 'gameshoppie', products: docs, successMsg:successMsg, noMessages:!successMsg});
    });
});


router.get('/add-cart/:id',function (req,res,next) {
    var productId=req.params.id;
    let idString=productId
    let objId = new ObjectID(idString);
    var cart= new Cart(req.session.cart? req.session.cart:{items:{}});
    dbConnect.get().collection('product').findOne({_id:objId},function(err,product) {
        if(err) {
            return err
        }
        cart.add(product,productId);
        req.session.cart=cart;
        console.log(req.session.cart)
        res.redirect('/')
    })
})

router.get('/reduce/:id',function (req,res,next) {

    var productId=req.params.id;
    var cart= new Cart(req.session.cart? req.session.cart:{items:{}});
    cart.reduceByOne(productId);
    req.session.cart=cart;
    res.redirect('/shopping-cart')

})

router.get('/remove/:id',function (req,res,next) {

    var productId=req.params.id;
    var cart= new Cart(req.session.cart? req.session.cart:{items:{}});
    cart.removeItems(productId);
    req.session.cart=cart;
    res.redirect('/shopping-cart')

})

router.get('/shopping-cart',function (req,res,next) {
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', {products:null})
    }
    else
    var cart= new Cart(req.session.cart);
    res.render('shop/shopping-cart',{products:cart.generateArray(req.session.cart),totalPrice:req.session.cart.totalPrice})

})

router.get('/checkout',isLoggedIn,function (req,res,next) {
    if (!req.session.cart) {
        return res.redirect('shop/shopping-cart')
    }

    var cart = new Cart(req.session.cart);
    var  errorMsg= req.flash('error')[0];
    res.render('shop/checkout', {totalPrice: req.session.cart.totalPrice, errorMsg:errorMsg, noError:!errorMsg})
})

router.post('/checkout', isLoggedIn ,function (req,res,next) {


    if (!req.session.cart) {
        return res.redirect('shop/shopping-cart')
    }
    var cart = new Cart(req.session.cart);


    const stripe = require('stripe')('sk_test_51H06OZFqeS0GhoxLKLUbnVvyNQZWQZJCpElUSmpFSC74ftMunEDCYclBchzN3QDXeYYCrSCrHXHA0Bgs1xq0VFFE00NoAMUR86');

    stripe.charges.create({
        amount:cart.totalPrice *100 ,
        currency: 'inr',
        source: "tok_amex", // obtained with Stripe.js
        description: "My First Test Charge (created for API docs)"
    },function(err, charge) {
            // asynchronously called
            if (err){
                req.flash('error',err.message)
                return res.redirect('/checkout')
            }

            var order= {

                user:req.user,
                cart:cart,
                address:req.body.address,
                name:req.body.name,
                paymentId:charge.id
            };

        dbConnect.get().collection('orders').insertOne(order);
        console.log(order)
                req.flash('success','successfully bought')
                req.session.cart=null;
                res.redirect('/')
        }
    );

})




module.exports = router;

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.session.oldURL= req.url;
    res.redirect('/user/signin');
}

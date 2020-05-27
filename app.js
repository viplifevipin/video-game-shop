var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs=require('express-handlebars');
var session=require('express-session');
var mongodb=require('mongodb');
var passport=require('passport');
var flash=require('connect-flash');



var db=require('./dbconfig/db-connect');
require('./config/passport');

var indexRouter = require('./routes/index');

var app = express();


// view engine setup

app.engine('.hbs', expressHbs({
  extname: '.hbs',
  defaultLayout: 'layout',
  partialsDir: path.join(__dirname, 'views/partials'),
  layoutsDir: path.join(__dirname, 'views/layouts')
}));
app.set('view engine', '.hbs');
app.set('views',path.join(__dirname,'views'))



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({secret:'mysupersecret',resave:false,saveUninitialized:false}))
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

db.connect(function (error) {

  if (error){
    console.log('Unable to connect database');
    process.exit(1);
  } else {
    console.log('Shopping cart Database connecetd successfully...');
  }

});
module.exports = app;

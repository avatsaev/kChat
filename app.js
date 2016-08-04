
/**
* Module dependencies.
*/

var port = process.env.PORT || 3003;
var env = process.env.NODE_ENV || "development";


var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');
var logger = require('morgan');
var _ = require("lodash");
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');



var root_route = require('./routes/index');

var app = express();

var server = app.listen(port);


console.log("---------------------------------SERVER_BOOT-----------------------------------PORT_"+port);
// all environments
app.set('port', port);
app.set('env', env);



app.locals.config = {
  env: env,
  backend: {
    url: {
      production: process.env.BACKEND_ADDR || "//localhost:3002",
      development: "//localhost:3002"
    }
  }
}


app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.use(favicon(__dirname + '/public/images/logo@2x.png'));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', root_route);
//app.use('/home', root_route);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

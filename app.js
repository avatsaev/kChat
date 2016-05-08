
/**
* Module dependencies.
*/

var port = process.env.PORT || 3002;
var express = require('express');
var http = require('http');
var fs = require('fs');
var path = require('path');
var mailer = require("nodemailer");
var logger = require('morgan');
var _ = require("lodash");
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// custom stuff
var chat  = require("./chat")
var tumbler = require("./tumbler")
var root_route = require('./routes/index');

// var https_options = {
//   key: fs.readFileSync('private/cert/kc-server-key.pem'),
//   cert: fs.readFileSync('private/cert/kc-server-cert.pem')
// };

var app = express();

var server = app.listen(port);
var socket = require('socket.io').listen(server);



chat.socket = socket;


console.log("---------------------------------SERVER_BOOT-----------------------------------PORT_"+port);
// all environments
app.set('port', port);
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


//SERVER CHAT------------------------------------------------



socket.on("connection", function (client) {

  client.on("join", function(data){

    var userData = JSON.parse(data);

    user = {}

    if (userData["username"]==undefined || userData["username"]=="") {
      user.username="User_"+Math.floor(Math.random()*110000);
    }

    if (userData["frq"]==undefined || userData["frq"]=="") {
      user.frq="1";
    }

    user.username = escapeHtml(userData["username"]).substring(0, 20);
    user.frq = escapeHtml(userData["frq"]).substring(0, 32);

    console.dir("frequency: "+user.frq);
    console.dir("usr: "+user.username);


    if(user.frq == "haltOff") chat.state="ready";

    else if(user.frq == "haltOn"){
      chat.state="halted";
      tumbler(null, "broadcast",null, {msg: "---System broadcast: server and frequency tumblers temporarily are halted, stand by..."});
    }

    if(chat.state=="halted"){
      client.emit("update", "Connection refused: server and frequency tumblers are temporarily halted...");
      return;
    }

    user.client_id = client.id


    //console.dir("frequency: "+userData["frq"]);
    //console.dir("user: "+userData["username"]);

    //chat.people[client.id] = userData;
    chat.people.push(user)

    console.log(chat.people)

    client.emit("update", "Welcome. You have connected to the server on the frequency "+user.frq+" MHz");

    tumbler(user.frq, "update", client, {msg: (user.username+" has joined the server on the frequency "+user.frq+" MHz") });

    tumbler(user.frq, "update-people", client, {user: user});

    tumbler(null, "broadcast",null, {msg: "---System broadcast: "+chat.people.length+" users connected on server."});

  });

  client.on("send", function(data){
    //console.dir(""+data);
    if(chat.state=="halted"){
      client.emit("update", "ERROR: Server and frequency tumblers are halted...");
      return;
    }

    var inData = JSON.parse(data);

    if(inData["msg"]==undefined || inData["msg"]=="" || inData["frq"]==undefined || inData["frq"]=="") return;


    inData["frq"]= escapeHtml(inData["frq"]).substring(0, 32);
    inData["msg"]= escapeHtml(inData["msg"]).substring(0, 512);

    console.dir("frequency: "+inData["frq"]);
    console.dir("message: "+inData["msg"]);

    tumbler(inData["frq"], "chat", client, {msg:inData["msg"] });


  });

  client.on("disconnect", function(){

    user = _.find(chat.people, {client_id: client.id})

    if(user){
      tumbler(user.frq, "update", client, { msg: (user.username + " left the frequency "+user.frq+" MHz") } );
      _.remove(chat.people, {client_id: user.client_id})

    }

    // delete chat.people[client.id];



    //socket.sockets.emit("update-people", people);
  });
});


function sendEmail(sbjct, msg){

  var transport = mailer.createTransport("direct", {debug: true});

  var mailOptions = {
    from: "KawaChat <noreply@kawachat.herokuapp.com>", // sender address
    to: "azero79@gmail.com", // list of receivers
    subject: sbjct, // Subject line
    text: msg // plaintext body
  }

  transport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
      return;
    }

  // response.statusHandler only applies to 'direct' transport
  response.statusHandler.once("failed", function(data){
    console.log(
      "Permanently failed delivering message to %s with the following response: %s",
      data.domain, data.response);
    });

    response.statusHandler.once("requeue", function(data){
      console.log("Temporarily failed delivering message to %s", data.domain);
    });

    response.statusHandler.once("sent", function(data){
      console.log("Message was accepted by %s", data.domain);
    });
  });
}

function escapeHtml(text) {
  console.log("REPLACE: "+text);
  if(text==undefined){
    return undefined;
  }
  return text.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

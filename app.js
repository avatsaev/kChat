
/**
 * Module dependencies.
 */
var people = {};
var port = process.env.PORT || 5000;
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mailer = require("nodemailer");

var app = express();
var server = app.listen(port);
var socket = require('socket.io').listen(server); 

var emails = true;
var state = "ready"; //ready, halted 


console.log("---------------------------------SERVER_BOOT-----------------------------------PORT_"+port);
// all environments
//app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


app.get('/', function(req, res){
  res.sendfile("views/index.html");
});
//app.get('/', routes.index);
//app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('KawaChat server listening on port ' + port);
});



//SERVER CHAT



socket.on("connection", function (client) {
		
    client.on("join", function(data){



		
		var userData = JSON.parse(data);


		if (userData["usr"]==undefined || userData["usr"]=="") {
			userData["usr"]="User_"+Math.floor(Math.random()*110000);
		}

		if (userData["frq"]==undefined || userData["frq"]=="") {
				userData["frq"]="1";
		}

		userData["usr"]= escapeHtml(userData["usr"]).substring(0, 20);
		userData["frq"]= escapeHtml(userData["frq"]).substring(0, 32);
		
		console.dir("frequency: "+userData["frq"]);
		console.dir("message: "+userData["usr"]);


		if(userData["frq"]=="haltOff") state="ready";

		else if(userData["frq"]=="haltOn"){
			state="halted";
			tumbler(null, "broadcast",null, {msg: "---System broadcast: server and frequency tumblers are halted..."});
			
		} 

		if(state=="halted"){

        	client.emit("update", "Connection refused: server and frequency tumblers are halted...");
        	return;
		} 
		
		
		//console.dir("frequency: "+userData["frq"]);
		//console.dir("user: "+userData["usr"]);
		
        people[client.id] = userData;
		
        client.emit("update", "Welcome. You have connected to the server on the frequency "+userData["frq"]+" MHz");

		tumbler(userData["frq"], "update", client, {msg: (userData["usr"]+" has joined the server on the frequency "+userData["frq"]+" MHz") });
		tumbler(userData["frq"], "update-people", client, null);
        tumbler(null, "broadcast",null, {msg: "---System broadcast: "+Object.keys(people).length+" users connected on server."});
        //socket.sockets.emit("update-people", people);

        if (emails && !(userData["usr"]=="avatsaev" || userData["frq"]=="1" || userData["frq"]=="haltOn" || userData["frq"]=="haltOff") ) {
        	
        	sendEmail("Connection notification: "+userData["usr"], (userData["usr"]+" has joined the server on the frequency "+userData["frq"]+" MHz"));

       	}



		
    });

    client.on("send", function(data){
		//console.dir(""+data);
		if(state=="halted"){
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
		
		
		//console.dir(socket.sockets);
		//{ '42OslOM5p-TdRbypq9CY': 'ust' }
		
        //socket.sockets.emit("chat", people[client.id], msg);

    });

    client.on("disconnect", function(){
		
		
		if(people[client.id]!=undefined){
			tumbler(people[client.id]["frq"], "update", client, { msg: (people[client.id]["usr"] + " has left the frequency "+people[client.id]["frq"]+" MHz") } );
		}

        //socket.sockets.emit("update", people[client.id]["usr"] + " has left the frequency "+people[client.id]["frq"]+" MHz");

        delete people[client.id];

		
        //socket.sockets.emit("update-people", people);
    });
});


function tumbler(frq, event, client, params){
	
	if(event=="update"){
		
		for (var userID in people) {

			if(people[userID]["frq"]==frq){
				if(userID!=client.id){
					socket.sockets.sockets[userID].emit("update", params.msg);
				}
			}
			
		}
	}
	
	if(event=="chat"){
		
		for (var userID in people) {
			
			if(userID!=client.id){
				
				if(people[userID]["frq"]==frq){
					socket.sockets.sockets[userID].emit("chat", people[client.id]["usr"], params.msg);
				}
		
			}

		}
		
	}
	
	if(event=="update-people"){
		
		msg = "---Users on this frequency: ";
		for (var userID in people) {
			
			if(people[userID]["frq"]==frq){
				msg=msg+"/"+people[userID]["usr"]+"/ - "
			}
			
		}
		
		for (var userID in people) {
			if(people[userID]["frq"]==frq){
				socket.sockets.sockets[userID].emit("update", msg);
			}
		}
		
		
		
	}
	
	if(event=="broadcast"){
		

			socket.sockets.emit("update", params.msg);
			
		
	}
	
	
	
	
}

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


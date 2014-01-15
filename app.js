
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

var app = express();
var server = app.listen(port);
var socket = require('socket.io').listen(server); 

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
		userData["usr"]= userData["usr"].substring(0, 20);
		
		//console.dir("frequency: "+userData["frq"]);
		//console.dir("user: "+userData["usr"]);
		
        people[client.id] = userData;
		
        client.emit("update", "Welcome. You have connected to the server on the frequency "+userData["frq"]+" MHz");

		tumbler(userData["frq"], "update", client, {msg: (userData["usr"]+" has joined the server on the frequency "+userData["frq"]+" MHz") });
        
        //socket.sockets.emit("update-people", people);
		
    });

    client.on("send", function(data){
		//console.dir(""+data);
		var inData = JSON.parse(data);
		
		console.dir("frequency: "+inData["frq"]);
		console.dir("message: "+inData["msg"]);

		tumbler(inData["frq"], "chat", client, {msg: escapeHtml(inData["msg"]).substring(0, 512) });
		
		
		//console.dir(socket.sockets);
		//{ '42OslOM5p-TdRbypq9CY': 'ust' }
        //socket.sockets.emit("chat", people[client.id], msg);

    });

    client.on("disconnect", function(){
		
		tumbler(people[client.id]["frq"], "update", client, { msg: (people[client.id]["usr"] + " has left the frequency "+people[client.id]["frq"]+" MHz") } );

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
					tumbler(null,"broadcast",null, {msg:"server is full"});
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
	
	if(event=="boradcast"){
		for (var userID in people) {

			socket.sockets.emit("update", params.msg);
			
		}
	}
	
	
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}


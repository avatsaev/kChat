

var ready;
var app_focus;
var frq="1";
var username="User_"+Math.floor(Math.random()*110000);
var messages=0;




$(document).ready(function(){

	var socket = io();


	$("#chat").hide();
	$("#name").focus();
	$("form").submit(function(event){
		event.preventDefault();
	});

	$("#join").click(function(){


		if ($("#name").val() != "") {

			username = $("#name").val();

		}

		if( $("#frq").val() != ""){

			frq = $("#frq").val();
		}


		var userData = { "username" : username, "frq": frq };

		socket.emit("join", JSON.stringify(userData) );

		$("#msgs").append("<li>Connecting...</li>");
		$("#login").hide();
		$("#chat").show("slow");
		$("#msg").focus();

		ready = true;


	});




	$("#send").click(function(){

		sendMsg();

	});

	$("#msg").keypress(function(e){
		if(e.which == 13) {

			sendMsg();

		}
	});


	function sendMsg(){

		var msg = $("#msg").val();

		if(msg=="") return;

		$("#msgs").append("<li><strong><span class='text-success'>"+username+" (Me)</span></strong>: " + escapeHtml(msg).substring(0, 512) + "</li>");

		var outData = { "msg" : msg, "frq": frq };
		socket.emit("send", JSON.stringify(outData));

		$("#msg").val("");

	}





	//===========================================================================



	socket.on("update", function(msg) {
		if(ready)
			$("#msgs").append("<li>" + msg + "</li>");
	})

	//socket.on("update-people", function(people){
	//	if(ready) {
	//		$("#people").empty();
	//		$.each(people, function(clientid, name) {
	//			$('#people').append("<li>" + name + "</li>");
	//		});
	//	}
	//});

	socket.on("chat", function(who, msg){
		if(ready) {
			if(app_focus==true){
				messages = messages+1;
				console.log("changing title...");
				document.title = "("+messages+") KawaChat";
			}
			$("#msgs").append("<li><strong><span class='text-success'>" + who + "</span></strong>: " +msg + "</li>");
		}
	});

	socket.on("disconnect", function(){
		$("#msgs").append("<li><strong><span class='text-warning'>The server is not available</span></strong></li>");
		$("#msg").attr("disabled", "disabled");
		$("#send").attr("disabled", "disabled");
	});




	//=============



	$(window).focus(function() {

		document.title = "KawaChat"

	    app_focus = true;
		console.log("focus");
		messages=0;

	}).blur(function() {
		//document.title = "(*) KawaChat"
		console.log("!focus");
	    app_focus = false;

	});




});



function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}

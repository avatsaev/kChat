

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
    $("#login-container").hide();
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

    // $("#msgs").append("<li class='msg-container'><strong><span class='username-label'>"+username+" (Me)</span></strong>: " + escapeHtml(msg).substring(0, 512) + "</li>").slideDown("fast");

    append_msg(msg, username, true);


    var outData = { "msg" : msg, "frq": frq };
    socket.emit("send", JSON.stringify(outData));

  }


  function append_msg(mesg, user, me){
    add_class = ""
    if(me){
      add_class = "me-msg"
    }

    $("<li class='msg-container'><strong><span class='username-label'>"+user+" </span></strong>: " + escapeHtml(mesg).substring(0, 512) + "</li>").appendTo("#msgs").addClass(add_class).show("fast")

    $("#msg").val("");
    var n = $(document).height();
    $('html, body').animate({ scrollTop: n }, 50);

  }





  //===========================================================================



  socket.on("update", function(msg) {
    if(ready)
      $("#msgs").append("<li>" + msg + "</li>");
  })

  socket.on("user_join", function(data){
    console.log("NEW USER JOINED");
    console.log(data);
  })

  //socket.on("update-people", function(people){
  //  if(ready) {
  //    $("#people").empty();
  //    $.each(people, function(clientid, name) {
  //      $('#people').append("<li>" + name + "</li>");
  //    });
  //  }
  //});

  socket.on("chat", function(who, msg){
    if(ready) {
      if(app_focus==true){
        messages = messages+1;
        console.log("changing title...");
        document.title = "("+messages+") KawaChat";
      }
      // $("#msgs").append("<li class='msg-container'><strong><span class='text-success'>" + who + "</span></strong>: " +msg + "</li>");
      append_msg(msg, who);
    }
  });

  socket.on("disconnect", function(){
    $("#msgs").append("<li class='msg-container'><strong><span class='text-warning'>The server is not available</span></strong></li>");
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

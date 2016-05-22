var app_focus, escapeHtml, frq, messages, ready, username;

console.log("app.coffee");

console.log("chat.coffee");

console.log("config.coffee");

console.log("login_ctrl.coffee");

console.log("main_ctrl.coffee");

console.log("routes.coffee");

ready = void 0;

app_focus = void 0;

frq = '1';

username = 'User_' + Math.floor(Math.random() * 110000);

messages = 0;

escapeHtml = function(text) {
  return text.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
};

$(document).ready(function() {
  var append_msg, sendMsg, socket;
  socket = io();
  sendMsg = function() {
    var msg, outData;
    msg = $('#msg').val();
    if (msg === '') {
      return;
    }
    append_msg(msg, username, true);
    outData = {
      'msg': msg,
      'frq': frq
    };
    return socket.emit('send', JSON.stringify(outData));
  };
  append_msg = function(mesg, user, me) {
    var add_class, n;
    add_class = '';
    if (me) {
      add_class = 'me-msg';
    }
    $("<li class='msg-container'><strong><span class='username-label'> " + user + " </span></strong>:  " + (escapeHtml(mesg).substring(0, 512)) + " </li>").appendTo('#msgs').addClass(add_class).show('fast');
    $('#msg').val('');
    n = $(document).height();
    return $('html, body').animate({
      scrollTop: n
    }, 50);
  };
  $('#chat').hide();
  $('#name').focus();
  $('form').submit(function(event) {
    return event.preventDefault();
  });
  $('#join').click(function() {
    var userData;
    if ($('#name').val() !== '') {
      username = $('#name').val();
    }
    if ($('#frq').val() !== '') {
      frq = $('#frq').val();
    }
    userData = {
      'username': username,
      'frq': frq
    };
    socket.emit('join', JSON.stringify(userData));
    $('#msgs').append('<li>Connecting...</li>');
    $('#login-container').hide();
    $('#chat').show('slow');
    $('#msg').focus();
    return ready = true;
  });
  $('#send').click(function() {
    return sendMsg();
  });
  $('#msg').keypress(function(e) {
    if (e.which === 13) {
      return sendMsg();
    }
  });
  socket.on('update', function(msg) {
    if (ready) {
      return $('#msgs').append('<li>' + msg + '</li>');
    }
  });
  socket.on('user_join', function(data) {
    console.log('NEW USER JOINED');
    return console.log(data);
  });
  socket.on('chat', function(who, msg) {
    if (ready) {
      if (app_focus === true) {
        messages = messages + 1;
        console.log('changing title...');
        document.title = '(' + messages + ') KawaChat';
      }
      return append_msg(msg, who);
    }
  });
  socket.on('disconnect', function() {
    $('#msgs').append('<li class=\'msg-container\'><strong><span class=\'text-warning\'>The server is not available</span></strong></li>');
    $('#msg').attr('disabled', 'disabled');
    return $('#send').attr('disabled', 'disabled');
  });
  return $(window).focus(function() {
    document.title = 'KawaChat';
    app_focus = true;
    console.log('focus');
    return messages = 0;
  }).blur(function() {
    console.log('!focus');
    return app_focus = false;
  });
});

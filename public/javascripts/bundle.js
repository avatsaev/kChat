var app, app_focus, escapeHtml, frq, messages, ready, username;

console.log("app.coffee");

app = angular.module('KC', ['ui.router', 'btford.socket-io']);

console.log("chat.coffee");

console.log("config.coffee");

console.log("login_ctrl.coffee");

app.controller('LoginCtrl', [
  '$scope', '$rootScope', function($scope, $rootScope) {
    $scope.login = {
      username: "",
      channel: ""
    };
    return $scope.on_login = function() {
      console.log("login:");
      return console.log($scope.login);
    };
  }
]);

app.factory('app_socket', function(socketFactory) {
  return socketFactory();
});

console.log("main_ctrl.coffee");

app.controller('MainCtrl', [
  '$scope', '$rootScope', function($scope, $rootScope) {
    console.log("main controller loaded");
    return $scope.on_login = function() {
      console.log("login:");
      return console.log($scope.login);
    };
  }
]);

console.log("routes.coffee");

app.config([
  '$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
      url: '/',
      controller: 'MainCtrl',
      templateUrl: 'views/home/index.html'
    }).state('channel', {
      url: "channel/:channel_id",
      controller: 'ChannelCtrl'
    });
    return $urlRouterProvider.otherwise('home');
  }
]);

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

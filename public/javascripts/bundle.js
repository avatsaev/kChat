var app;

app = angular.module('KC', ['ui.router', 'ui.bootstrap', 'ngTouch', 'ngAnimate', "ui.event", "ui.keypress"]);

app.controller('ChannelsCtrl.show', [
  '$scope', '$rootScope', '$stateParams', '$state', 'User', 'Socket', function($scope, $rootScope, $stateParams, $state, User, Socket) {
    if (User.is_empty()) {
      User.generate();
      User.channel = $stateParams.channel_id;
    }
    $scope.append_msg = function(msg, user, me) {
      var add_class, n;
      add_class = '';
      if (me) {
        add_class = 'me-msg';
      }
      $("<li class='msg-container'><strong><span class='username-label'> " + user + " </span></strong>:  " + ($scope.escapeHtml(msg).substring(0, 512)) + " </li>").appendTo('#msgs').addClass(add_class);
      $('#msg').val('');
      n = $(document).height();
      return $('html, body').animate({
        scrollTop: n
      }, 50);
    };
    $scope.send_msg = function() {
      var msg, outData;
      msg = $('#msg').val();
      if (msg === '') {
        return;
      }
      $scope.append_msg(msg, User.name, true);
      outData = {
        'msg': msg,
        'frq': User.channel,
        'usr': User.name
      };
      return Socket.emit('send', outData);
    };
    $scope.escapeHtml = function(text) {
      return text.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    };
    Socket.on('update', function(msg) {
      return $('#msgs').append('<li class="system-msg">' + msg + '</li>');
    });
    Socket.on('chat', function(who, msg) {
      return $scope.append_msg(msg, who);
    });
    return Socket.emit("join", {
      username: User.name,
      frq: User.channel
    });
  }
]);

console.log("config.coffee");

app.controller('HomeCtrl', [
  '$scope', '$rootScope', '$stateParams', '$state', 'User', function($scope, $rootScope, $stateParams, $state, User) {
    return $scope.on_login = function() {
      if (!$scope.login || !$scope.login.username || !$scope.login.channel) {
        User.generate();
      } else {
        User.name = $scope.login.username;
        User.channel = $scope.login.channel;
      }
      return $state.go("channel", {
        channel_id: User.channel
      });
    };
  }
]);

app.controller('MainCtrl', [
  '$scope', '$rootScope', '$stateParams', '$state', function($scope, $rootScope, $stateParams, $state) {
    return $rootScope.$on('user:login', function(data) {
      return console.log(data);
    });
  }
]);

app.config([
  '$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider.state('home', {
      url: '/home',
      controller: 'HomeCtrl',
      templateUrl: '/views/home/index.html'
    }).state('channel', {
      url: "/channels/:channel_id",
      controller: 'ChannelsCtrl.show',
      templateUrl: '/views/channels/show.html'
    });
    return $urlRouterProvider.otherwise('home');
  }
]);

app.factory('Socket', [
  '$rootScope', function($rootScope) {
    var socket;
    socket = io("//kchat-backend-dev.us-west-2.elasticbeanstalk.com");
    return {
      on: function(eventName, callback) {
        return socket.on(eventName, function() {
          var args;
          args = arguments;
          return $rootScope.$apply(function() {
            return callback.apply(socket, args);
          });
        });
      },
      emit: function(eventName, data, callback) {
        return socket.emit(eventName, data, function() {
          var args;
          args = arguments;
          return $rootScope.$apply(function() {
            if (callback) {
              return callback.apply(socket, args);
            }
          });
        });
      }
    };
  }
]);

app.factory('User', [
  function() {
    var user;
    user = {
      name: "",
      channel: ""
    };
    user.generate = function() {
      user.name = 'User_' + Math.floor(Math.random() * 110000);
      user.channel = "1";
    };
    user.is_empty = function() {
      return user.name === "" || user.channel === "";
    };
    return user;
  }
]);

console.log "chat.coffee"


console.log "channel_ctrl.coffee"


app.controller 'ChannelsCtrl.show', [
  '$scope'
  '$rootScope'
  '$stateParams'
  '$state'
  'User'
  'Socket'

  ($scope, $rootScope, $stateParams, $state, User, Socket) ->

    if User.is_empty()
      User.generate()
      User.channel = $stateParams.channel_id

    $scope.append_msg = (msg, user, me) ->
      add_class = ''
      if me
        add_class = 'me-msg'

      $("<li class='msg-container'><strong><span class='username-label'> #{user} </span></strong>:  #{$scope.escapeHtml(msg).substring(0, 512)} </li>").appendTo('#msgs').addClass(add_class).show 'fast'

      $('#msg').val ''
      n = $(document).height()
      $('html, body').animate { scrollTop: n }, 50

    $scope.send_msg = ->
      msg = $('#msg').val()
      if msg == ''
        return

      $scope.append_msg msg, User.name, true
      outData =
        'msg': msg
        'frq': User.channel
      Socket.emit 'send', outData

    $scope.escapeHtml = (text) ->
      text.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace /"/g, '&quot;'

    console.log User

    Socket.on 'update', (msg) ->
      $('#msgs').append '<li>' + msg + '</li>'

    Socket.on 'chat', (who, msg) ->
      $scope.append_msg msg, who

    Socket.emit "join",
      username: User.name
      frq: User.channel

]

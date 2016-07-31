app.factory 'Socket', [
  '$rootScope'
  ($rootScope) ->

    socket = io("//kchat-backend-dev2.vuhavghkyx.us-west-2.elasticbeanstalk.com")

    {
      on: (eventName, callback) ->
        socket.on eventName, ->
          args = arguments
          $rootScope.$apply ->
            callback.apply socket, args

      emit: (eventName, data, callback) ->
        socket.emit eventName, data, ->
          args = arguments
          $rootScope.$apply ->
            if callback
              callback.apply socket, args

    }
]

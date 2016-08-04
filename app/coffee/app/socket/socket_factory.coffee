app.factory 'Socket', [
  '$rootScope'
  ($rootScope) ->

    socket = io("//kchat-backend-dev.us-east-1.elasticbeanstalk.com")
    #socket = io("//localhost:3002")
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

      disconnect: ->
        socket.disconnect()

      remove_listener: (event) ->
        socket.removeListener(event)

    }
]

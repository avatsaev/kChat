console.log "main_ctrl.coffee"


app.controller 'MainCtrl', [
  '$scope'
  '$rootScope'
  ($scope, $rootScope) ->
    console.log "main controller loaded"
    $scope.on_login = ->
      console.log "login:"
      console.log $scope.login

    # $rootScope.on 'user:login', (data) ->
    #   console.log data
]

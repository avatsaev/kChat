console.log "login_ctrl.coffee"


app.controller 'MainCtrl', [
  '$scope'
  '$rootScope'
  ($scope, $rootScope) ->
    $scope.login =
      username: ""
      channel: ""

    $rootScope.on 'user:login', (data) ->
      console.log data
]

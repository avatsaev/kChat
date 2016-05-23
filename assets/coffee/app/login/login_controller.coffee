console.log "login_ctrl.coffee"


app.controller 'LoginCtrl', [
  '$scope'
  '$rootScope'
  ($scope, $rootScope) ->
    $scope.login =
      username: ""
      channel: ""

    $scope.on_login = ->
      console.log "login:"
      console.log $scope.login

]

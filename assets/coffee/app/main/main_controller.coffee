console.log "main_ctrl.coffee"


app.controller 'MainCtrl', [
  '$scope'
  '$rootScope'
  ($scope, $rootScope) ->
    $scope.test = 'Hello sssworld!'

    $rootScope.on 'user:login', (data) ->
      console.log data
]

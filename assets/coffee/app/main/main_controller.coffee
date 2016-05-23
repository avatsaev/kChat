console.log "main_ctrl.coffee"


app.controller 'MainCtrl', [
  '$scope'
  '$rootScope'
  '$stateParams'
  '$state'

  ($scope, $rootScope, $stateParams, $state) ->

    console.log "MainCtrl"
    $scope.on_login = ->
      console.log "login:"
      console.log $scope.login

    # $rootScope.on 'user:login', (data) ->
    #   console.log data
]

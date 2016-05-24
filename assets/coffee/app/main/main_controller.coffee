app.controller 'MainCtrl', [
  '$scope'
  '$rootScope'
  '$stateParams'
  '$state'

  ($scope, $rootScope, $stateParams, $state) ->

    console.log "MainCtrl"

    $rootScope.$on 'user:login', (data) ->
      console.log data
]

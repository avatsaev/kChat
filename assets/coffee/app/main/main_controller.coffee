app.controller 'MainCtrl', [
  '$scope'
  '$rootScope'
  '$stateParams'
  '$state'

  ($scope, $rootScope, $stateParams, $state) ->
    
    $rootScope.$on 'user:login', (data) ->
      console.log data
]

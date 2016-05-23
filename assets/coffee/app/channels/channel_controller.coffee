console.log "chat.coffee"


console.log "channel_ctrl.coffee"


app.controller 'ChannelsCtrl.show', [
  '$scope'
  '$rootScope'
  '$stateParams'
  '$state'

  ($scope, $rootScope, $stateParams, $state) ->

    console.log "ChannelsCtrl"

]

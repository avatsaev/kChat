console.log "routes.coffee"



app.config [
  '$stateProvider'
  '$urlRouterProvider'
  ($stateProvider, $urlRouterProvider) ->



    $stateProvider.state('home',
      url: '/'
      controller: 'MainCtrl'
      templateUrl: 'views/home/index.html'

    ).state('channel',
      url: "channel/:channel_id"
      controller: 'ChannelCtrl'
    )


    $urlRouterProvider.otherwise 'home'

]

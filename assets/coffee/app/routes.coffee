console.log "routes.coffee"



app.config [

  '$stateProvider'
  '$urlRouterProvider'
  '$locationProvider'

  ($stateProvider, $urlRouterProvider, $locationProvider) ->


    console.log "loading routes"

    $stateProvider.state('home',
      url: '/home'
      controller: 'MainCtrl'
      templateUrl: '/views/home/index.html'

    ).state('channel',
      url: "/channels/:channel_id"
      controller: 'ChannelsCtrl.show'
      templateUrl: '/views/channels/show.html'
    )


    $urlRouterProvider.otherwise 'home'
    # $locationProvider.html5Mode(true)

]

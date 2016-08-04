

app.config [

  '$stateProvider'
  '$urlRouterProvider'
  '$locationProvider'

  ($stateProvider, $urlRouterProvider, $locationProvider) ->


    $stateProvider.state('home',
      url: '/home'
      controller: 'HomeCtrl'
      templateUrl: '/views/home/index.html'

    ).state('channel',
      url: "/channels/:channel_id"
      controller: 'ChannelsCtrl.show'
      templateUrl: '/views/channels/show.html'
    )


    $urlRouterProvider.otherwise 'home'
    # $locationProvider.html5Mode(true)

]

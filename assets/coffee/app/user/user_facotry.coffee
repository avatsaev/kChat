app.factory 'User', [ () ->

  user =
    name: ""
    channel: ""

  user.generate = ->
    user.name = 'User_' + Math.floor(Math.random() * 110000)
    user.channel = "1"
    return

  user.is_empty = ->
    user.name == "" or user.channel == ""


  user

]

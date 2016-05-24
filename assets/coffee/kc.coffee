# ready = undefined
# app_focus = undefined
# frq = '1'
# username = 'User_' + Math.floor(Math.random() * 110000)
# messages = 0
#
# escapeHtml = (text) ->
#   text.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace /"/g, '&quot;'
#
# $(document).ready ->
#   socket = io()
#
#   sendMsg = ->
#     msg = $('#msg').val()
#     if msg == ''
#       return
#
#     append_msg msg, username, true
#     outData =
#       'msg': msg
#       'frq': frq
#     socket.emit 'send', JSON.stringify(outData)
#
#
#   append_msg = (mesg, user, me) ->
#     add_class = ''
#     if me
#       add_class = 'me-msg'
#
#     $("<li class='msg-container'><strong><span class='username-label'> #{user} </span></strong>:  #{escapeHtml(mesg).substring(0, 512)} </li>").appendTo('#msgs').addClass(add_class).show 'fast'
#
#     $('#msg').val ''
#     n = $(document).height()
#     $('html, body').animate { scrollTop: n }, 50
#
#
#   $('#chat').hide()
#   $('#name').focus()
#
#   $('form').submit (event) ->
#     event.preventDefault()
#   #
#   # $('#join').click ->
#   #   if $('#name').val() != ''
#   #     username = $('#name').val()
#   #   if $('#frq').val() != ''
#   #     frq = $('#frq').val()
#   #   userData =
#   #     'username': username
#   #     'frq': frq
#   #   socket.emit 'join', JSON.stringify(userData)
#   #   $('#msgs').append '<li>Connecting...</li>'
#   #   $('#login-container').hide()
#   #   $('#chat').show 'slow'
#   #   $('#msg').focus()
#   #   ready = true
#
#   $('#send').click ->
#     sendMsg()
#
#   $('#msg').keypress (e) ->
#     if e.which == 13
#       sendMsg()
#
#
#   socket.on 'update', (msg) ->
#     if ready
#       $('#msgs').append '<li>' + msg + '</li>'
#
#   socket.on 'user_join', (data) ->
#     console.log 'NEW USER JOINED'
#     console.log data
#
#
#   socket.on 'chat', (who, msg) ->
#     if ready
#       if app_focus == true
#         messages = messages + 1
#         console.log 'changing title...'
#         document.title = '(' + messages + ') KawaChat'
#       # $("#msgs").append("<li class='msg-container'><strong><span class='text-success'>" + who + "</span></strong>: " +msg + "</li>");
#       append_msg msg, who
#
#   socket.on 'disconnect', ->
#     $('#msgs').append '<li class=\'msg-container\'><strong><span class=\'text-warning\'>The server is not available</span></strong></li>'
#     $('#msg').attr 'disabled', 'disabled'
#     $('#send').attr 'disabled', 'disabled'
#
#   #=============
#   $(window).focus(->
#     document.title = 'KawaChat'
#     app_focus = true
#     console.log 'focus'
#     messages = 0
#   ).blur ->
#     #document.title = "(*) KawaChat"
#     console.log '!focus'
#     app_focus = false

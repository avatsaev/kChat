var chat  = require("./chat")


function tumbler(frq, event, client, params){

  if(event=="update"){

    for (var userID in chat.people) {

      if(chat.people[userID]["frq"]==frq){
        if(userID != client.id){
          chat.socket.sockets.sockets[userID].emit("update", params.msg);
        }
      }
    }
  }

  if(event=="chat"){

    for (var userID in chat.people) {

      if(userID!=client.id){

        if(chat.people[userID]["frq"]==frq){
          chat.socket.sockets.sockets[userID].emit("chat", chat.people[client.id]["usr"], params.msg);
        }
      }
    }
  }

  if(event=="update-people"){

    msg = "---Users on this frequency: ";
    for (var userID in chat.people) {

      if(chat.people[userID]["frq"]==frq){
        msg=msg+"/"+chat.people[userID]["usr"]+"/ - "
      }
    }

    for (var userID in chat.people) {
      if(chat.people[userID]["frq"]==frq){
        chat.socket.sockets.sockets[userID].emit("update", msg);
      }
    }
  }

  if(event=="broadcast"){
    chat.socket.sockets.emit("update", params.msg);
  }
}


module.exports = tumbler

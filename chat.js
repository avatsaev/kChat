

var chat = {
  socket: undefined,
  people: [],
  emails: false,
  state: "ready", //ready, halted

  spinup: function(){
    console.log(this)
  }
}


module.exports = chat

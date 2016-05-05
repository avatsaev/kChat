

var chat = {
  socket: undefined,
  people: {},
  emails: true,
  state: "ready", //ready, halted

  spinup: function(){
    console.log(this)
  }
}




module.exports = chat

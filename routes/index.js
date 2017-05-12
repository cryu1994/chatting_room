module.exports = function Route(app, server){
  var io = require('socket.io').listen(server);
  users = []; //create user array so we could keep track of users
  connection = []; // also created a connction array so i could keep track of whos online and offline
  app.get('/', function(req, res){
    res.render('index');
  });

  io.sockets.on('connection', function(socket){
    connection.push(socket);
    console.log("Connected: %s sockets connected", connection.length);

    //disconnections
    socket.on('disconnect', function(data){
      users.splice(users.indexOf(socket.username), 1)
      connection.splice(connection.indexOf(socket), 1);
      console.log("Diconnected: %s sockets connected", connection.length);

    });

    socket.on("send_message", function(data){
      io.sockets.emit("new_message", {msg: data['message'], user: socket.username['username']})
      console.log(data['message']);
    });
    //new user
    socket.on('new_user', function(data, callback){
      callback(true);
      socket.username = data;
      users.push(socket.username['username']);
      // console.log(users);
      updateUsername();
    });
    function updateUsername(){
      io.sockets.emit('get users', users);
    };
  });

}

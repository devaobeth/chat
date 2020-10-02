
var express = require("express");
var app = express();
 
var http = require("http").createServer(app);

var io = require("socket.io")(http);
var mysql = require("mysql");
var connection = mysql.createConnection({
    "host" : "localhost",
    "user" : "root",
    "password" : "",
    "database" : "chat"
})

connection.connect(function(error){

})
var users = [];

io.on("connection", function(socket){
    console.log("User connected" + socket.id);
    socket.on("user_connected", function(username){
        users[username] = socket.id;
        io.emit("user_connected", username);
    });
    socket.on("send_message", function(data){
        var socketId = users[data.receiver];
        io.to(socketId).emit("new_message", data);
        connection.query("INSERT INTO messages(sender, receiver, message) VALUES ('"+data.sender+"','"+data.receiver+"', '"+data.message+"')", function(error, result){
            
        });
    })
})

http.listen(3000, function(){
    console.log('server started 300');
})


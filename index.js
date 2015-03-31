var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var index = 0;
var ToDos = {};
app.use(express.static(__dirname + '/dist'));


io.on('connection', function(socket){
    console.log('a user connected');

    socket.emit('initiate', ToDos);

    socket.on('disconnect', function(){
	console.log('user disconnected');
    });
    
    socket.on('newToDo', function(content) {
	ToDos[index] = content;
	// console.log(ToDos);
	io.emit('appendToDo', ++index, content);
    });
    
    socket.on('deleteToDo', function(index) {
	delete ToDos.index;
	io.emit('deleteToDo', index);
    });

    socket.on('toDoChanged', function(index, newContent) {
	ToDos[index] = newContent;
	console.log(index, newContent);
	socket.broadcast.emit('toDoChanged', index, newContent);
    });
});

http.listen(3000, function(){
    console.log('listening on http://127.0.0.1:3000');
});


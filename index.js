var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var index = 0;
var ToDos = {};

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/dist'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket) {
    console.log('a user connected');


    socket.emit('initiate', ToDos);

    socket.on('disconnect', function(){
	console.log('user disconnected');
    });
    
    socket.on('newToDo', function(content) {
	var toPrepend = {'isDone': false, 'content': content}
	ToDos[index] = toPrepend;
	io.emit('prependToDo', index++, toPrepend);
    });
    
    socket.on('deleteToDo', function(index) {
	console.log(index + 'deleted');
	delete ToDos[index];
	io.emit('deleteToDo', index);
    });

    socket.on('toDoChanged', function(index, newContent) {
	ToDos[index].content = newContent;
	console.log(index, newContent);
	socket.broadcast.emit('toDoChanged', index, newContent);
    });
    
    socket.on('toggleToDo', function(index) {
	ToDos[index].isDone = !ToDos[index].isDone;
	socket.broadcast.emit('toggleToDo', index);
    });
    
    socket.on('deleteDone', function() {
	io.emit('deleteDone');
    })
});

http.listen(app.get('port'), function() {
    console.log('listening at http://localhost:' + app.get('port'));
});


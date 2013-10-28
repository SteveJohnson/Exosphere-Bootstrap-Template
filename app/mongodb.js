
// Programmatically make sure we're always running using Forever
if(!require('./lib/ExoForever.js')()) {
	return;
}

// Get an app object with niceties like logging, static asset handling, and pretty URLs built in
var app = require('./lib/ExoExpress.js')({
	assetsDir: 'assets',
	htmlDir: 'html',
	enableSocketIO: true
});

// Setup the ready route, join room and broadcast to room.
app.io.route('ready', function(req) {
	console.log("Received ready event from " + req.session.ip);
    req.io.join(req.session.roomName);
    req.io.room(req.session.roomName).broadcast('announce', {
        message: 'New client with ip ' + req.session.ip + ' in the ' + req.session.roomName + ' room'
    })
});

// Tell everyone else when the mouse moves!
app.io.route('mousemove', function(req) {
	//console.log("Received mousemove event from " + req.session.ip + " with data " + JSON.stringify(req.data));
    req.io.room(req.session.roomName).broadcast('mousemove', req.data)
});

// Log when someone connects
app.io.on('connection', function(socket) {
	var connection = socket.manager.handshaken[socket.id];
	connection.session.ip = connection.address.address;
	connection.session.roomName = 'voting';
	console.log(connection.session.ip + " connected");
	console.log("There are now " + Object.size(socket.namespace.sockets) + " clients connected");
});

// Log when someone disconnects
app.io.route('disconnect', function(req) {
	console.log(req.session.ip + " disconnected");
	console.log("There are now " + Object.size(req.socket.namespace.sockets) + " clients connected");
});

// Start our server on port 80 (http is 80, https is 443)
var httpServer = app.listen(80);
console.log("Listening on port 80");



	



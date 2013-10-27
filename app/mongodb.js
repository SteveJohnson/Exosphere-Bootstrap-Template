
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

	req.session.ip = req.handshake.address.address;
	console.log("Received ready event from " + req.session.ip);

	var roomName = 'voting';
    req.io.join(roomName);
    req.io.room(req.data).broadcast('announce', {
        message: 'New client with ip ' + req.session.ip + ' in the ' + roomName + ' room. '
    })
})


// Start our server on port 80 (http is 80, https is 443)
var httpServer = app.listen(80);
console.log("Listening on port 80");



	



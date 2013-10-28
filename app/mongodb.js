
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

// Load the Mongo and Monk modules
var mongo = require('mongodb');
var monk = require('monk');

// Connect to Mongo on port 27017 (the default) and use the database 'exosphere-votes'
var db = monk('localhost:27017/exosphere-votes');

// Get a reference to our 'votes' and 'mousemoves' collection inside the 'exosphere-votes' database
// If it doesn't exist yet, it will be created
var votesCollection = db.get('votes');
var mousemovesCollection = db.get('mousemoves');
var hoversCollection = db.get('hovers');

// DEBUG - uncomment to erase your database
/*
votesCollection.drop(function(err) {
	if(err) console.error(err)
});
mousemovesCollection.drop(function(err) {
	if(err) console.error(err)
});
hoversCollection.drop(function(err) {
	if(err) console.error(err)
});
*/

// Make sure Mongo adds indexes on fields to make our queries faster
votesCollection.index('session.ip', { unique: true }, function(err) {
	if(err) console.error(err)
});
votesCollection.index('option', { unique: true }, function(err) {
	if(err) console.error(err)
});
mousemovesCollection.index('timestamp', function(err) {
	if(err) console.error(err)
});
mousemovesCollection.index('session.id timestamp', function(err) {
	if(err) console.error(err)
});
mousemovesCollection.index('session.ip timestamp', function(err) {
	if(err) console.error(err)
});
hoversCollection.index('option', function(err) {
	if(err) console.error(err)
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
    
    // Save the event to Mongo
    mousemovesCollection.insert({ 
    	session: {
    		ip: req.session.ip,
    		id: req.session.id
    	},
    	point: req.data.point,
    	timestamp: new Date().getTime()
    }, function (err, doc) {
		if(err) {
			console.error("Failed to insert '" + JSON.stringify(doc) + "' into Mongo");
			console.error(err);
			return;
		}
		//console.log("Inserted '" + JSON.stringify(doc) + "' into Mongo");
	});
});

// Receive votes!
app.io.route('vote', function(req) {
	console.log("Received vote event from " + req.session.ip + " with data " + JSON.stringify(req.data));

    //Try and write to Mongo, on failure, tell the user why
    votesCollection.insert({ 
    	session: {
    		ip: req.session.ip,
    		id: req.session.id
    	},
    	option: req.data.option,
    	hoverTime: req.data.time
    }, function (err, doc) {
		if(err) {
			if (err.code == 11000) {
				// This IP address has already voted
				console.warn("User with ip " + req.session.ip + " has already voted!");
				votesCollection.findOne({ 
					'session.ip': req.session.ip
				})
				.on('success', function (otherDoc) {
					console.log(otherDoc);
					req.io.emit('alert', {
						msg: "Only one vote per IP address.\n\nIt looks like you've already voted for '" + otherDoc.option + "'."
					});					
				});
			}else {
				console.error("Failed to insert '" + JSON.stringify(doc) + "' into Mongo");
				console.error(err);
				req.io.emit('alert', {
					msg: "Hrm. We weren't able to save your vote. :("
				});	
			}
			return;
		}
		console.log("Inserted '" + JSON.stringify(doc) + "' into Mongo");
	});
});

app.io.route('mouseleave', function(req) {
	console.log("Received mouseleave event from " + req.session.ip + " with data " + JSON.stringify(req.data));

	// Save the event to Mongo
    hoversCollection.insert({ 
    	session: {
    		ip: req.session.ip,
    		id: req.session.id
    	},
    	option: req.data.option,
    	hoverTime: req.data.time
    }, function (err, doc) {
		if(err) {
			console.error("Failed to insert '" + JSON.stringify(doc) + "' into Mongo");
			console.error(err);
			return;
		}
		//console.log("Inserted '" + JSON.stringify(doc) + "' into Mongo");
	});
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



	



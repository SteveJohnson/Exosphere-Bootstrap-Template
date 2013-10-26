
// Programmatically make sure we're always running using Forever
var child = require('./lib/ExoForever.js')(__filename);
if(child) { return; }

// Load the "express" module
var express = require("express");

// Get an instance of express to build our app with
var app = express();

// All requests to the homepage (http://somesite/) respond with "Hello World"
app.get('/', function(req, res){
	console.log("Received request for homepage!");
	res.send('Hello World');
});

// All other requests look in the "html" folder for the file
var staticAssetsDir = __dirname + '/../';
app.use(express.static(staticAssetsDir));
console.log("Serving static requests from " + staticAssetsDir);

// Run our server on port 3000 (http is 80, https is 443)
app.listen(3000);
console.log("Listening on port 3000");
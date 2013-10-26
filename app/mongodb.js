
// Programmatically make sure we're always running using Forever
var child = require('./lib/ExoForever.js')(__filename);
if(child) { return; }

// Get an app object with niceties like logging and static asset handling built in
var app = require('./lib/ExoExpress.js')({
	baseDir: __dirname.substring(0, __dirname.lastIndexOf('/')),
	assetsDir: 'assets',
	htmlDir: 'html'
});



// TODO: app logic goes here




// Run our server on port 80 (http is 80, https is 443)
app.listen(80);
console.log("Listening on port 80");








// catch the uncaught errors that weren't wrapped in a domain or try catch statement
// do not use this in modules, but only in applications, as otherwise we could have multiple of these bound
process.on('uncaughtException', function(err) {
	// handle the error safely
	forever.stop(scriptName);
	console.log("--ERROR-- UncaughtException: " + JSON.stringify(err));
	console.log(err.stack);
	console.log("Stopping forever process with pid: " + monitor.child.pid);
});
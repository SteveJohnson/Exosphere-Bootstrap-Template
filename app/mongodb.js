
// Programmatically make sure we're always running using Forever
if(!require('./lib/ExoForever.js')()) {
	return;
}

// Get an app object with niceties like logging, static asset handling, and pretty URLs built in
var app = require('./lib/ExoExpress.js')({
	assetsDir: 'assets',
	htmlDir: 'html'
});

//TODO: logic here



// Run our server on port 80 (http is 80, https is 443)
var server = app.listen(80);
console.log("Listening on port 80");



	



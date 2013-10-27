
// Programmatically make sure we're always running using Forever
if(!require('./lib/ExoForever.js')()) {
	return;
}

// Get an app object with niceties like logging and static asset handling built in
var app = require('./lib/ExoExpress.js')({
	assetsDir: 'assets',
	htmlDir: 'html'
});



// TODO: app logic goes here




// Run our server on port 80 (http is 80, https is 443)
app.listen(80);
console.log("Listening on port 80");






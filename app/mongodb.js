
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




// Run our server on port 3000 (http is 80, https is 443)
app.listen(3000);
console.log("Listening on port 3000");


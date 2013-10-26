
// Programmatically make sure we're always running using Forever
var forever = new (require('./lib/ExoForever.js'))();
if(!forever.isThisContextValid(__filename)) { return; }

// Get an app object with niceties like logging and static asset handling built in
var app = require('./lib/ExoExpress.js')({
	baseDir: __dirname.substring(0, __dirname.lastIndexOf('/')),
	assetsDir: 'assets',
	htmlDir: 'html'
});

console.log("I'm lik here!");

// TODO: app logic goes here




// Run our server on port 80 (http is 80, https is 443)
app.listen(80);
console.log("Listening on port 80");








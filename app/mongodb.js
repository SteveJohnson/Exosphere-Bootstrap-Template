
// This is the root directory (one up from the 'app' folder)
var baseDir = __dirname + '/../';

// Programmatically make sure we're always running using Forever
if(!require('./MyForeverMonitor.js')(__filename)) { return; }

// Load the "express" module
var express = require("express");

// Get an instance of express to build our app with
var app = express();

// Register the .htm suffix to be rendered by EJS
app.engine('htm', require('ejs').renderFile);

// All other requests look in the "html" folder for the file
app.use('/assets', express.static(baseDir + 'assets'));
console.log("Serving static requests from " + baseDir);

// Do some fancy URL rewriting to remove the html/ prefix and .htm suffix
app.get(/^([^\.]+)$/, function (req, res, next) {
	var page = req.params[0];
	if(page == '' || page == '/') {
		page = '/index';
	}
	var path = baseDir + 'html' + page + '.htm';
	console.log("Redirecting to html page: " + path);
	res.render(path, function(err, html) {
		if(err) {
			console.log(err);
			next('route');
		}else {
			res.send(html);
		}
	});
});

// Log all errors
app.use(function(err, req, res, next) {
	console.error(err.stack);
	next(err);
});

// Respond to the client (browser) when we have an error
app.use(function(err, req, res, next) {
	res.status(500);
	res.render('error', { error: err });
});

// Run our server on port 3000 (http is 80, https is 443)
app.listen(3000);
console.log("Listening on port 3000");


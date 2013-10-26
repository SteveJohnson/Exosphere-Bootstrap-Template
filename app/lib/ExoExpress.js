
function ExoExpress(opts) {

	var baseDir = opts.baseDir;
	var assetsDir = (opts.assetsDir.indexOf('/') != 0 ? '/' : '') + opts.assetsDir;
	var htmlDir = (opts.htmlDir.indexOf('/') != 0 ? '/' : '') + opts.htmlDir;
	var verbose = opts.verbose || false;

	var prettyBaseDir = baseDir.substring(baseDir.lastIndexOf('/')+1);

	// Load the "express" module
	var express = require("express");

	// Get an instance of express to build our app with
	var app = express();

	// Register the .htm suffix to be rendered by EJS
	app.engine('htm', require('ejs').renderFile);

	// All asset requests go directly to the assets directory
	app.use(assetsDir, express.static(baseDir + assetsDir));

	// Log all requests
	if(verbose) {
		app.use(express.logger());	
	}else {
		app.use(function(req, res, next){
			console.log('%s %s', req.method, req.url);
			next();
		});
	}

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

	// Do some fancy URL rewriting to remove the html/ prefix and .htm suffix
	app.get(/^([^\.]+)$/, function (req, res, next) {
		var page = req.params[0];
		if(page == '' || page == '/') {
			page = '/index';
		}
		var path = baseDir + htmlDir + page + '.htm';
		//console.log("Serving HTML page: " + path);
		res.render(path, function(err, html) {
			if(err) {
				//The file doesn't exist - proceed
				next('route');
			}else {
				res.send(html);
			}
		});
	});
	
	console.log("Serving asset requests from folder '" + prettyBaseDir + assetsDir + "'");
	
	return app;
}

module.exports = ExoExpress;
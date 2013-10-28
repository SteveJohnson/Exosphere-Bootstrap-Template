
function ExoExpress(opts) {

	var scriptName = process.mainModule.filename;
	var appDir = scriptName.substring(0, scriptName.lastIndexOf('/'));
	var baseDir = appDir.substring(0, appDir.lastIndexOf('/'));
	var assetsDir = (opts.assetsDir.indexOf('/') != 0 ? '/' : '') + opts.assetsDir;
	var htmlDir = (opts.htmlDir.indexOf('/') != 0 ? '/' : '') + opts.htmlDir;
	var verbose = opts.verbose || false;
	var enableSocketIO = opts.enableSocketIO || false;

	var prettyBaseDir = baseDir.substring(baseDir.lastIndexOf('/')+1);
	var prettyScriptName = scriptName.substring(scriptName.lastIndexOf('/')+1);

	// Load the "express" module
	var express = require("express.io");

	// Get an instance of express to build our app with
	var app = express();
	
	// Enable Socket.IO if required
	if(enableSocketIO) {
		app.http().io();
	}
	
	// Start session support
	app.use(express.cookieParser())
	app.use(express.session({secret: 'Exosphere'}))

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
	
	// Override the app.listen() function to provide a helpful error message if possible
	(function() {
		var oldAppListen = app.listen;
		app.listen = errorAwareAppListen;
		function errorAwareAppListen() {
			var server = oldAppListen.apply(app, arguments); // Use #apply in case `init` uses `this`
			server.on('error', function(err) {
				if(err.code == 'EACCES') {
					console.error("******************************************");
					console.error("ERROR: Insufficient permissions");
					console.error("Try running the app as an administrator");
					console.error("eg. sudo " + process.argv[0].substring(process.argv[0].lastIndexOf('/')+1) + ' ' + scriptName.replace(baseDir+'/',''));
					console.error("******************************************");
					process.exit(-1);
				}else {
					console.error(err);
				}
			});
			return server;
		}
	})();
	
	
	console.log("Serving asset requests from folder '" + prettyBaseDir + assetsDir + "'");
	
	return app;
}

Object.size = function(obj) {
	var size = 0;
	for(var key in obj) {
		if (obj.hasOwnProperty(key)) size++;
	}
	return size;
}

module.exports = ExoExpress;
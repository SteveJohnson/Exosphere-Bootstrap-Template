
/*
* Keeps a script running by using Forever programmatically
*
* Usage: if(!require('./ExoForever.js')(__filename)) { return; }
*
* More notes: http://zoomq.qiniudn.com/ZQScrapBook/ZqFLOSS/data/20120327190237/
*
*/

function ExoForever(scriptName) {

	var appDir = __dirname.substring(0, __dirname.lastIndexOf('/') - 1);
	var baseDir = appDir.substring(0, appDir.lastIndexOf('/'));
	var prettyScriptName = scriptName.substring(scriptName.lastIndexOf('/')+1);
	var prettyDirName = __dirname.substring(__dirname.lastIndexOf('/')+1);

	// If we have been passed an argument 'direct_launch', then Forever is good to go!
	if(process.argv.length > 2 && process.argv[2] == 'direct_launch') {
		console.log("");
		console.log("---------- Executing app at " + prettyScriptName + "----------");
		console.log("");
		return false;
	}

	var forever = require('forever');

	var monitor = forever.start(scriptName, {
		max: 10, //Prevents the runaway error issue
		watch: true,
		watchDirectory: baseDir,
		watchIgnoreDotFiles: baseDir + '.foreverignore',
		//logFile: 'logs/forever.log',
		//outFile: 'logs/output.log',
		//errFile: 'logs/error.log',	
		options: [
			'direct_launch'
		]
	});

	monitor.on('start', function () {
		forever.startServer(monitor);
	});
	
	monitor.on('error', function(err) {
		console.log("Error: " + err);
	});

	monitor.on('exit', function() {
		console.log("Node app '" + scriptName + "' has terminated abnormally");
	});

	monitor.on('stdout', function(data) {
		if(typeof data == 'string') {
			console.log(data);		
		}
	});
	monitor.on('stderr', function(data) {
		if(typeof data == 'string') {
			console.log("ERROR: " + data);
		}
	});
	
	console.log("Forever launched '" + prettyScriptName + "'");
	console.log("Forever is watching '" + prettyDirName + "'");

	return monitor;
}

module.exports = ExoForever;
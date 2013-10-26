
/*
* Keeps a script running by using Forever programmatically
*
* Usage: if(!require('./MyForeverMonitor.js')(__filename)) { return; }
*
* More notes: http://zoomq.qiniudn.com/ZQScrapBook/ZqFLOSS/data/20120327190237/
*/

function MyForeverMonitor(scriptName) {

	// If we haven't been passed an argument 'direct_launch', abort
	if(process.argv.length > 2 && process.argv[2] == 'direct_launch') {
		return true;
	}

	var forever = require('forever');

	var watchDirectory = __dirname + '/../';
	var monitor = forever.start(scriptName, {
		watchDirectory: watchDirectory,
		watchIgnoreDotFiles: '.foreverignore',
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
		console.log("Child has terminated");
	});

	console.log("Forever launched '" + scriptName + "'");
	console.log("Forever is watching '" + watchDirectory + "'");
	
	/*
	forever.tail(scriptName, 5, function (err, log) {
		if (err) {
			return forever.log.error(err.message);
		}
		console.log(log.file.magenta + ':' + log.pid + ' - ' + log.line);
	});
	*/
	
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

	return false;
}

module.exports = MyForeverMonitor;
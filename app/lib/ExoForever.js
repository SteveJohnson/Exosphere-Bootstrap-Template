/*
* Keeps a Node app running by using Forever programmatically
*
* Usage: 
* require('./lib/ExoForever.js');
*
* More notes: http://zoomq.qiniudn.com/ZQScrapBook/ZqFLOSS/data/20120327190237/
*
*/

function ExoForever() {

	var ON_READY_LAUNCH_ARG = 'ExoForever_Ready';

	var forever = require('forever');

	this.monitor = null;

	this.scriptName = process.mainModule.filename;
	this.appDir = __dirname.substring(0, __dirname.lastIndexOf('/') - 1);
	this.baseDir = this.appDir.substring(0, this.appDir.lastIndexOf('/'));
	this.prettyScriptName = this.scriptName.substring(this.scriptName.lastIndexOf('/')+1);
	this.prettyDirName = this.baseDir.substring(this.baseDir.lastIndexOf('/')+1);

	var me = this;

	this.init = function() {
				
		// If we have been passed the argument indicating we're ready, then Forever is good to go!
		if(process.argv.length > 2 && process.argv[2] == ON_READY_LAUNCH_ARG) {		
			console.log("");
			console.log("---------- Executing app at " + me.prettyScriptName + "----------");
			return true;
		}else {
			console.log("Spawning a Forever process to monitor '" + me.prettyScriptName + "'...");
			me.launchForeverProcess(function(monitor) {
				console.log("Forever process monitoring app '" + me.prettyScriptName + "' spawned successfully");
				console.log("Forever is watching directory '" + me.prettyDirName + "' for changes");
				process.emit('quit');			
			});
			return false;
		}	
	};
	
	this.launchForeverProcess = function(callback) {
	
		this.monitor = forever.start(this.scriptName, {
			max: 10, //Prevents the runaway error issue
			watch: true,
			watchDirectory: this.baseDir,
			watchIgnoreDotFiles: this.baseDir + '.foreverignore',
			//logFile: 'logs/forever.log',
			//outFile: 'logs/output.log',
			//errFile: 'logs/error.log',	
			options: [
				ON_READY_LAUNCH_ARG
			]
		});

		this.monitor.on('start', function () {
			forever.startServer(me.monitor);
			me.initUncaughtExceptionHandler();
			if(callback) {
				callback(me.monitor);
			}
		});

		this.monitor.on('error', function(err) {
			console.error(err);
		});

		this.monitor.on('exit', function() {
			console.log("ExoForever: Node app '" + me.prettyScriptName + "' has terminated abnormally");
		});

		this.monitor.on('stdout', function(data) {
			if(typeof data == 'string') {
				console.log(data);		
			}
		});
		
		this.monitor.on('stderr', function(data) {
			if(typeof data == 'string') {
				console.error(data);
			}
		});		
	};
	
	this.getAllProcesses = function(callback) {
		forever.list(false, function(err, processes) {
			if(err) {
				console.error("Failed on forever.list: " + err);
				callback([]);
			}
			callback(processes);
		});
	};

	this.initUncaughtExceptionHandler = function() {
		// Catch the uncaught errors that weren't wrapped in a domain or try catch statement
		// Be careful to not use this in modules (as I have done here) as having more than one of these bound is... not ideal
		process.on('uncaughtException', function(err) {
			
			console.error("UncaughtException: " + JSON.stringify(err));
			console.error(err.stack);
			
			me.getAllProcesses(function(processes) {
				if(processes) {
					console.log("--- Forever process list ---");
					console.log(processes);
					console.log("----------------------------");
					console.log("Stopping app process with uid: " + me.monitor.uid);
					forever.stop(me.monitor.uid);	
				}else {
					console.log("No reported app processes running (likely because the app crashed on startup)");
				}		
				me.monitor.emit('exit');
								
				// Kill this Forever process
				console.log("Terminating ExoForever monitoring process");
				process.exit(1);
			});
		});
	};
}

var exoForever = new ExoForever();

module.exports = exoForever.init
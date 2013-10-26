
/*
* Keeps a script running by using Forever programmatically
*
* Usage: if(!require('./ExoForever.js')(__filename)) { return; }
*
* More notes: http://zoomq.qiniudn.com/ZQScrapBook/ZqFLOSS/data/20120327190237/
*
*/

function ExoForever() {

	var forever = require('forever');
	var me = this;

	
	this.process = null;
	this.monitor = null;
	this.scriptName = null;

	this.isThisContextValid = function(scriptName) {
		
		this.scriptName = scriptName;
		this.appDir = __dirname.substring(0, __dirname.lastIndexOf('/') - 1);
		this.baseDir = this.appDir.substring(0, this.appDir.lastIndexOf('/'));
		this.prettyScriptName = this.scriptName.substring(this.scriptName.lastIndexOf('/')+1);
		this.prettyDirName = this.baseDir.substring(this.baseDir.lastIndexOf('/')+1);

		// If we have been passed an argument 'direct_launch', then Forever is good to go!
		if(process.argv.length > 2 && process.argv[2] == 'direct_launch') {		
			forever.list(false, function(err, processes) {
				if(err) {
					console.error("Failed on forever.list: " + err);
					return;
				}
				for(var i in processes) {
					if(processes[i].file == this.scriptName) {
						this.process = processes[i];
						console.log("");
						console.log("Process has been started successfully - foreverPid="+this.process.foreverPid);
						console.log("---------- Executing app at " + this.prettyScriptName + "----------");
						console.log("");
						break;
					}
				}
			});
			if(!this.process) {
				console.log("Forever process appears to have not spawned - trying again to spawn a Forever process...");
				return this.launchForeverProcess();			
			}
			return false;
		}else {
			console.log("Spawning a Forever process to monitor '" + this.prettyScriptName + "'...");
			return this.launchForeverProcess();	
		}	
	};
	
	this.launchForeverProcess = function() {
	
		this.monitor = forever.start(this.scriptName, {
			max: 10, //Prevents the runaway error issue
			watch: true,
			watchDirectory: this.baseDir,
			watchIgnoreDotFiles: this.baseDir + '.foreverignore',
			//logFile: 'logs/forever.log',
			//outFile: 'logs/output.log',
			//errFile: 'logs/error.log',	
			options: [
				'direct_launch'
			]
		});

		this.monitor.on('start', function () {
			forever.startServer(this.monitor);
			me.initUncaughtExceptionHandler();
		});

		this.monitor.on('error', function(err) {
			console.error("Error: " + err);
		});

		this.monitor.on('exit', function() {
			console.log("ExoForever: Node app '" + this.prettyScriptName + "' has terminated abnormally");
		});

		this.monitor.on('stdout', function(data) {
			if(typeof data == 'string') {
				console.log(data);		
			}
		});
		this.monitor.on('stderr', function(data) {
			if(typeof data == 'string') {
				console.error("ERROR: " + data);
			}
		});
		
		console.log("Forever process monitoring app '" + this.prettyScriptName + "' spawned successfully");
		console.log("Forever is watching directory '" + this.prettyDirName + "' for changes");

		return this.monitor;
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
					
					console.log("Stopping Forever process with uid: " + me.monitor.uid);
					forever.stop(me.monitor.uid);	
				}else {
					console.log("No running Forever processes");
				}		
			});

			// Kill this Forever process
			console.log("Terminating Forever process");
			process.exit(1);
		});
	};
}

module.exports = ExoForever;
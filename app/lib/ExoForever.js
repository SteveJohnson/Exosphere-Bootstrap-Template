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
			console.log("----------------- Executing app " + me.prettyScriptName + "-----------------");
			return true;
		}else {
			console.log("Spawning a Forever process to monitor '" + me.prettyScriptName + "'...");
			me.launchForeverProcess(function(monitor) {
				console.log("ExoForever: Monitored Node app '" + me.prettyScriptName + "' spawned successfully");
				console.log("ExoForever: Watching directory '" + me.prettyDirName + "' for changes");
				process.emit('quit');			
			});
			return false;
		}	
	};
	
	this.launchForeverProcess = function(callback) {
	
		this.monitor = forever.start(this.scriptName, {
			max: 3, //Prevents the runaway error issue
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
		
		this.monitor.on('exit:code', function (code, signal) {
			if(code && code == 255) {
				//-1/255 is our "code" for terminate ExoForever
				console.log("ExoForever: Node app '" + me.prettyScriptName + "' requested termination from ExoForever with exit code="+code);		
				me.cleanup();			
			}else {
				console.log("ExoForever: Node app '" + me.prettyScriptName + "' terminated with code=" + code + ", signal=" + signal);		
			}
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
	};
	
	this.cleanup = function() {
		// Kill the monitored app process
		console.log("ExoForever: Terminating Node app '" + me.prettyScriptName + "'");		
		me.monitor.emit('exit');
						
		// Kill this Forever process
		console.log("ExoForever: Terminating ExoForever monitoring process");		
		console.log("--------------------------------------------------------------");
		
		process.exit(1);
	};

	this.initUncaughtExceptionHandler = function() {
		// Catch the uncaught errors that weren't wrapped in a domain or try catch statement
		// Be careful to not use this in modules (as I have done here) as having more than one of these bound is... not ideal
		process.on('uncaughtException', function(err) {
			
			console.error("UncaughtException: " + JSON.stringify(err));
			console.error(err.stack);
			
			me.cleanup();
		});
	};
}

var exoForever = new ExoForever();

module.exports = exoForever.init
// Create a Point class and a wrapper cursor variable for cleaner code
function Point(x, y) {
	this.x = x;
	this.y = y;
};

function ExoHeatmap(opts) {

	var cursor = {
		current: null,
		lastSample: null
	};
	var isSampling = false;
	var heatmap = null;
	var heatmapEl = null;
	
	var me = this;
	
	this._init = function() {

		// Extend the heatmap element to full size of the browser window
		heatmapEl = $('body');
		//heatmapEl = $("<div id='heatmapArea' style='position:absolute;top:0px;left:0px;'></div>");
		//$('body').append(heatmapEl);
		heatmapEl.css('width', $(document).width());
		heatmapEl.css('height', $(document).height());
	
		// Create a Heatmap
		heatmap = h337.create({
			element: heatmapEl[0],
			radius: 20,
			opacity: 30,
			max: 20,
			visible: false,
			gradient: { 
				0.45: "rgb(0,0,255)", 
				0.55: "rgb(0,255,255)", 
				0.65: "rgb(0,255,0)", 
				0.95: "yellow", 
				1.0: "rgb(255,0,0)"
			}
		});
	
		// Dynamically modify our sample rate and submit the data
		var sampleRate = 100;
		var SAMPLE_RATE_STEP = 15;
		var MIN_SAMPLE_RATE = 30;
		var MAX_SAMPLE_RATE = 200;
		var storeCursorSample = function() {

			// Dynamically adjust our sample rate so so we don't over sample idle users
			var dist = cursor.lastSample == null ? 0 : 
				Math.sqrt(
					Math.pow(cursor.current.x - cursor.lastSample.x, 2) +
					Math.pow(cursor.current.y - cursor.lastSample.y, 2)
				)
			;
			cursor.lastSample = cursor.current;
		
			var logDist = dist;
			if(logDist == Infinity || logDist == -Infinity) {
				logDist = 0;
			}
			sampleRate = Math.max(MIN_SAMPLE_RATE, Math.min(sampleRate + SAMPLE_RATE_STEP - logDist, MAX_SAMPLE_RATE));
			//console.log(sampleRate);

			// Add the point to the visual heatmap if the user isn't idling
			if(sampleRate != MAX_SAMPLE_RATE) {
			
				// Draw immediately on our local heatmap
				me.addPoint(cursor.current);
			
				if(opts.mousemoveCallback) {
					opts.mousemoveCallback(cursor.current);
				}
			}
		
			// And queue up our subsequent sampling
			setTimeout(storeCursorSample, sampleRate);
		};
  
		// Add datapoint entries when the mouse moves
		heatmapEl.mousemove(function(e) {
			cursor.current = new Point(e.pageX, e.pageY);
			//console.log('mousemove: ' + JSON.stringify(cursor));
		
			if(!isSampling) {
				isSampling = true;
				storeCursorSample();
			}
		});
	
		// Add a secret corner for enabling the heatmap --- oOooOooo
		$('body').append($("<div id='toggleHeatmap' style='width:200px;height:200px;position:fixed;bottom:0px;right:0px'></div>"));
		$('body').children().not(heatmapEl).css('z-index', $('canvas', heatmapEl).css('z-index')+1);
		$('#toggleHeatmap').click(function() {
			heatmap.toggleDisplay();
			if(opts.toggleDislayCallback) {
				opts.toggleDislayCallback(heatmap.get('visible'));
			}
		});
	};
	
	this.setVisible = function(visible) {
		if(heatmap.get('visible') != visible) {
			heatmap.toggleDisplay();
		}
	};
	
	this.setData = function(data) {
		heatmap.store.setDataSet(data);
	};
	
	this.addPoint = function(point) {
		heatmap.store.addDataPoint(
			point.x, 
			point.y, 
			1
		);
	};
	
	
	this._init();
};

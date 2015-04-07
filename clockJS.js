/**
 * clockJS - a lightweight JavaScript plugin for generating and animating a nice & clean clock.
 * Copyright (C) 2015 Oliver Davies - olliedaviess(at)icloud(dot)com | http://www.olliedavies.co.uk
 * Licensed under MIT.
 * Date: 07/04/2015
 * @author Oliver Davies (@OllieDaavies)
 * @version 0.1
 *
 */


clockJS = function(config){
	//debug options
	if (!config.id) {alert('Missing id parameter for clock!'); return false;}
	if (!document.getElementById(config.id)) {alert('No element with id: \''+config.id+'\' found!'); return false;} 

	// configurable parameters
	this.config = {
		// id : string 
		// this is container element id
		id : config.id,

		// textColor : string
		// color of tick values
		textColor : (config.textColor) ? config.textColor : '#7f8c8d',

		// handOneColour : string
		// color of hour-minute hand
		handOneColor : (config.gaugeColor) ? config.gaugeColor : '#444444',


		// handTwoColor : string
		// colour of minute-second hand
		handTwoColor : (config.handTwoColor) ? config.handTwoColor : '#8e44ad',

		// font : string
		// font to be used for date and hour marks
		font : (config.font) ? config.font : 'Trebuchet MS',
		
		// tickFontWeight : int
		// font weight to be used for hour mark ticks
		tickFontWeight : (config.fontWeight) ? config.fontWeight : 500,
		
		// dateFontWeight : int
		// font weight to be used for hour mark ticks
		dateFontWeight : (config.dateFontWeight) ? config.dateFontWeight : 300,
	};
	
	// canvas
	document.getElementById(this.config.id).innerHTML = '';	
	this.canvas = Raphael(this.config.id, '100%', '100%');
	
	//rotate the canvas container 90deg CCW
	var e = document.getElementById(this.config.id).children[0], deg = -90;
    e.style.webkitTransform = 'rotate(' + deg + 'deg)'; 
    e.style.mozTransform    = 'rotate(' + deg + 'deg)'; 
    e.style.msTransform     = 'rotate(' + deg + 'deg)'; 
    e.style.oTransform      = 'rotate(' + deg + 'deg)'; 
    e.style.transform       = 'rotate(' + deg + 'deg)'; 

	// canvas dimensions
	var canvasW = document.defaultView.getComputedStyle(document.getElementById(this.config.id), '').getPropertyValue('width').slice(0, -2) * 1;
	var canvasH = document.defaultView.getComputedStyle(document.getElementById(this.config.id), '').getPropertyValue('height').slice(0, -2) * 1;

	// widget dimensions
	var widgetW, widgetH;
	
	if (canvasW > canvasH) {
		widgetW = canvasH;
		widgetH = canvasH;
	} else {
		widgetW = canvasW;
		widgetH = canvasW;
	}

	//delta
	var dx = widgetW/2;
	var dy = widgetH/2;

	//radius
	var rad = widgetW/2;
	
	//draw hour markers
	for(i = 0; i <= 12; i++){
		var x = rad + Math.round((rad-16) * Math.cos(30 * i * Math.PI / 180));
		var y = rad + Math.round((rad-16) * Math.sin(30 * i * Math.PI / 180));
		if (i != 0){
			this.canvas.text(x, y, i).attr({'transform':'r90,' + x + ',' + y, 'font-weight': this.config.tickFontWeight, 'font-size':'15%', 'font-family': this.config.font, 'fill':this.config.textColor});
		};
	};
	
	//draw ticks
	for(i = 0; i < 60; i++){
		var sx = rad + Math.round((rad-10) * Math.cos(6 * i * Math.PI / 180));
		var sy = rad + Math.round((rad-10) * Math.sin(6 * i * Math.PI / 180));
		var ex = rad + Math.round((rad-20) * Math.cos(6 * i * Math.PI / 180));
		var ey = rad + Math.round((rad-20) * Math.sin(6 * i * Math.PI / 180));
				
		if (i % 5){
			this.canvas.path("M" + sx + " " + sy + "L" + ex + " " + ey).attr({'stroke':this.config.textColor});
		}	
	}
	
	//current system time
	var d = new Date();
	var h = d.getHours();
	var m = d.getMinutes();
	var s = d.getSeconds();
	var l = d.getMilliseconds();
	
	h = h + (m/60);
	m = m + (s/60);
	
	//draw date text object
	this.txtDateObj = this.canvas.text((rad * 1.8), dy, getDateString(d)).attr({'transform':'r90,' + dx + ',' + dy,'font-size':'30%','font-family':this.config.font, 'text-anchor':'end', 'font-weight': this.config.dateFontWeight, 'fill':this.config.textColor});
	this.txtDateObj.id = this.config.id + '-txtDateObj';

	//draw hour-minute hand path object
	this.minutehandObj = this.canvas.path(["M", getHourCoords(h)[0], getHourCoords(h)[1], "C", getHourCoords(h)[0], getHourCoords(h)[1], dx, dy, getMinuteCoords(m)[0], getMinuteCoords(m)[1]]).attr({'stroke':this.config.handOneColor, 'stroke-width':7, 'stroke-linecap':'round'});
	this.minutehandObj.id = this.config.id + '-minutehandObj';
	
	//draw minute-second hand path object
	this.secondHandObj = this.canvas.path(["M", getMinuteCoords(m)[0], getMinuteCoords(m)[1], "C", getMinuteCoords(m)[0], getMinuteCoords(m)[1], dx, dy, getSecondCoords(s,true)[0], getSecondCoords(s,true)[1]]).attr({'stroke':this.config.handTwoColor, 'stroke-width':3, 'stroke-linecap':'round'});
	this.secondHandObj.id = this.config.id + '-secondHandObj';

	//draw second hand highlight circle object
	this.circleSecondHighlight = this.canvas.circle(getSecondCoords(s)[0], getSecondCoords(s)[1], 11);
 	this.circleSecondHighlight. attr({'stroke-width': 3, 'stroke':this.config.handTwoColor});
 	this.circleSecondHighlight.id = this.config.id + "-circleSecondHighlight";
 	
	//update clock every 1000ms (1s)
 	var self = this;
	setInterval(function(){
	
		//get current system time
		d = new Date();
		h = d.getHours();
		m = d.getMinutes();
		s = d.getSeconds();
		l = d.getMilliseconds();
		
		h = h + (m/60);
		m = m + (s/60);
		s = s + (l/1000);
		
		//animate minute-second hand and second hand highlight circle
		self.canvas.getById(self.config.id+'-secondHandObj').animate({path: ['M', getMinuteCoords(m)[0], getMinuteCoords(m)[1], 'C', getMinuteCoords(m)[0], getMinuteCoords(m)[1], dx, dy, getSecondCoords(s, true)[0], getSecondCoords(s, true)[1]]},1000);
		self.canvas.getById(self.config.id+'-circleSecondHighlight').animate({cx: getSecondCoords(s)[0], cy: getSecondCoords(s)[1]}, 1000);
		
		//animate hour-minute hand
		self.canvas.getById(self.config.id+'-minutehandObj').animate({path: ['M', getHourCoords(h)[0], getHourCoords(h)[1], 'C', getHourCoords(h)[0], getHourCoords(h)[1], dx, dy, getMinuteCoords(m)[0], getMinuteCoords(m)[1]]},1000);
	
		//re-write current date to text object to accomidate for midnight
		self.canvas.getById(self.config.id+'-txtDateObj').attr({'text':getDateString(d)});
	},1000);

	
	//function to create the date string 
	//getDateString([Date])
	function getDateString(d){
		var days = ['SUN','MON','TUES','WED','THURS','FRI','SAT'];
		var spaces = [' ',' '];
		var t = days[d.getDay()] + spaces.join('') + d.getDate();
		return t
	}


	//function to get the xy coords of where the hour-hand should be
	//getHourCoords([Time])
	function getHourCoords(t){
		var ret = [];
		ret[0] = rad + (rad * 0.60) * Math.cos(30 * t * Math.PI / 180); //x
		ret[1] = rad + (rad * 0.60) * Math.sin(30 * t * Math.PI / 180); //y
		return ret;
	};


	//function to get the xy coords of where the minute-hand should be
	//getMinuteCoords([Time])
	function getMinuteCoords(t){
		var ret = [];
		ret[0] = rad + (rad * 0.85) * Math.cos(6 * t * Math.PI / 180); //x
		ret[1] = rad + (rad * 0.85) * Math.sin(6 * t * Math.PI / 180); //y
		return ret;
	};


	//function to get the xy coords of where the second-hand should be
	//getMinuteCoords([Time],[Boolean])
	function getSecondCoords(t, srt){
		var ret = [];
		if (srt == true){
			ret[0] = rad + (rad * 0.86) * Math.cos(6 * t * Math.PI / 180); //x
			ret[1] = rad + (rad * 0.86) * Math.sin(6 * t * Math.PI / 180); //y
		} else {
			ret[0] = rad + (rad * 0.923) * Math.cos(6 * t * Math.PI / 180); //x
			ret[1] = rad + (rad * 0.923) * Math.sin(6 * t * Math.PI / 180); //y
		}
		return ret;
	};
};

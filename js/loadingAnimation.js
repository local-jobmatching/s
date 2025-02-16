/*
	Loading Animation 1.2
	2015-07-01
	
	1.3 - automated or defined random breakpoints
	1.2 - reset/start function to restart the animation;
	1.1 - two functions to trigger before animation starts
	
	Usage in HTML:
	
	progressAni.holder = "#anyDivYouWish";
	progressAni.textHolder = "#anyListWithTextsYouWish";                        // ul > li
	progressAni.delayedBy = 500;                                                // delay animation
	progressAni.speed = 50;                                                     // speed of the animation
	progressAni.breakPoints = [24,28,36,48,64,76,91];                           // percentage % breakpoints where text will be displayed
	progressAni.delays = [400,500,500,800,600,400,700];                         // miliseconds for how long the text will be displayed
	progressAni.triggerStartHolder = '.animateLoading';                         // name of the class that triggers the animation after click
	progressAni.triggerAtStart = function(){ |content to define| };  			// what happens before the animation, after triggering click
	progressAni.triggerAtStartWithDelay = function(){ |content to define| };	// what happens before the animation with a delay
	progressAni.triggerAtTheEnd = function(){ |content to define| };            // what happens after the animation
*/

var progressAni = {
	holder: "#loadingAni",
	textHolder: "#textHolder",
	delayedBy: 500,
	speed: 50,
	breakPoints: [24,28,36,48,64,76,91], 
	delays: [400,500,500,800,600,400,700],
	triggerStartHolder: '.animateLoading',
	triggerAtStart: function(){},
	triggerAtStartWithDelay: function(){},
	triggerAtTheEnd: function(){},
	interAni: null,
	increaseBy: 1,
	iterator: 0,
	autoBreakpoints: false,
	
	startAni: function(){
		progressAni.triggerAtStart();
		setTimeout(function(){
			progressAni.triggerAtStartWithDelay();
			animateProgressBar();
		}, progressAni.delayedBy);
	},
	
	resetAni: function(){
		$(progressAni.holder +', '+ progressAni.textHolder ).show();
		progressAni.iterator = 0;
		progressAni.increaseBy = 1;
		progressAni.interAni = null;
		$(progressAni.textHolder +' li').hide();
		$(progressAni.holder +' div').width(0);
		$(progressAni.holder +' span').text("0%");
	}
}

$(document).ready(function () {
	$(progressAni.textHolder +' li').hide(); // hide texts
	$(progressAni.holder).html('<div><span></span></div>'); // inject stylable elements
	
	prepeareBreakpointsAndDelays();
	
	$(document).on('click', progressAni.triggerStartHolder, function(){ // action trigger
		progressAni.startAni();
	});
});

function animateProgressBar(){
	progressAni.interAni = setInterval(function(){
		if( progressAni.increaseBy == progressAni.breakPoints[ progressAni.iterator ] ) {
			$(progressAni.textHolder +' li:eq('+ (progressAni.iterator-1) +')').hide(); // hide previous message
			$(progressAni.textHolder +' li:eq('+ progressAni.iterator +')').fadeIn(200); // show current message
			clearInterval(progressAni.interAni);	
			setTimeout(function(){
				animateProgressBar(); // continue
			}, progressAni.delays[ progressAni.iterator++ ]);
		}

		if( $(progressAni.holder +' div').width() < $(progressAni.holder).width() && progressAni.increaseBy <= 100 ) {
			$(progressAni.holder +' div span').text( progressAni.increaseBy +'%') // add procentage text
			$(progressAni.holder +' div').css({ 'width': progressAni.increaseBy++ +'%'})
		}else{
			clearInterval(progressAni.interAni);
			progressAni.triggerAtTheEnd(); // execute end action
		}
	}, progressAni.speed);
}


function prepeareBreakpointsAndDelays(){
	if( progressAni.autoBreakpoints == "auto") {
		var amount = $(progressAni.textHolder +' li').length
		progressAni.breakPoints = generateRandomBreakpoints( amount );
		progressAni.delays = generateRandomDelays( amount );
	}else{
		if( isNumeric(progressAni.autoBreakpoints) && progressAni.autoBreakpoints > 0) {
			progressAni.breakPoints = generateRandomBreakpoints( progressAni.autoBreakpoints );
			progressAni.delays = generateRandomDelays( progressAni.autoBreakpoints );
		}
	}	
}

function randomValuesBetween(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomBreakpoints(amount) {
	var steps = 100 / amount;
	var ret = Array();
	for(var i=1; i<=amount; i++)
		ret.push( Math.ceil( randomValuesBetween( (i-1)*steps, i*steps ) ) );
	if( ret[0] == 0 ) ret[0] = 3;
	return ret;
}

function generateRandomDelays(amount) {
	var ret = Array();
	for(var i=1; i<=amount; i++)
		ret.push( Math.ceil( randomValuesBetween( 200, 400 ) ) );
	return ret;
}

function isNumeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}
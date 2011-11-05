// JavaScript Document

var effectScript 	= null;
var lastLink 		= null;
var lastXSlide 		= 1;
var canMove 	    = true;
var xCurrent 		= 0;
var NUMLINKS 		= 16;

document.observe('dom:loaded', function() 
{
	$('page').setOpacity(0.0);
	$('hamster').setOpacity(0.0);
	$('scriptLinksBox').setOpacity(0.0);
	// $('footer').setOpacity(0.0);
	
	var buttons = $('headerButtons').childElements();
	buttons[0].addClassName('brightGreen');
	// buttons[2].observe('click', callCharacters);
	for (var i = 0; i < buttons.length; i++) {
		buttons[i].setOpacity(0.0);
		buttons[i].style.top = '-48px';
		
		if (i != 0) {
			buttons[i].observe('click', displayLink);
		}
	}
	
	var footers = $('footer').childElements();
	// buttons[2].observe('click', callCharacters);
	for (var i = 0; i < footers.length; i++) {
		footers[i].setOpacity(0.0);
		new Effect.Move(footers[i], {duration: 0, mode: 'relative', x: 0, y: 48});
	}	
	
	var episodes = $('episodeLinks').childElements();
	for (var i = 0; i < episodes.length; i++) {
		episodes[i].observe('click', displayEpisode);	
	};
	
	$('vimeoBox').hide();
	
	initEpisodes();
});

Event.observe(window, 'load', function()
{
	var buttons = $('headerButtons').childElements();
	for (var i = 0; i < buttons.length; i++) {
		new Effect.Parallel([
			new Effect.Opacity(buttons[i], {sync: true, from: 0.0, to: 0.95}),
			new Effect.Move(buttons[i],    {sync: true, mode: 'relative', x: 0, y: 48})
		], {duration: 0.4, delay: 1.8 + (i / 10)});
	}
	
	$('loading').fade({duration: 0.5});
	$('page').appear({delay: 0.5, duration: 0.4, from: 0.0, to: 1.0, afterFinish: function()
	{
		new Effect.Parallel([
			new Effect.Opacity('hamster', {sync: true, from: 0.0, to: 1.0}),
			new Effect.Move('hamster',    {sync: true, mode: 'relative', x: 0, y: 510})
		], {duration: 0.8, delay: 0.4});
		
			
		$('logo').fade({duration: 0.8, delay: 0.4, from: 1.0, to: 0.1, afterFinish: function() {
			new Ajax.TXMRequest('episodes.php?id=s2e7', {onSuccess: loadEpisode});
		}});
		
		$('scriptLinksBox').appear({duration: 0.8, delay: 0.9, from: 0.0, to: 0.9});
	}});
	
	var footers = $('footer').childElements();
	for (var i = 0; i < footers.length; i++) {
		footers[i].observe('mouseover', hoverFooter);
		footers[i].observe('mouseout', clearFooter);			
		new Effect.Parallel([
			new Effect.Opacity(footers[i], {sync: true, from: 0.0, to: 0.5}),
			new Effect.Move(footers[i],    {sync: true, mode: 'relative', x: 0, y: -48})
		], {duration: 0.4, delay: 1.8 + ((footers.length - i) / 10)});
	}
});
										   
function dumpErrors(response) {
	$('dumpster').insert(response + '<br>', 'top');
};
		
function initEpisodes()
{
	var scriptLinks = $('scriptLinks').childElements();
	
	$('scriptLinks').style.width = (158 * NUMLINKS + 4) + 'px';
	$('scriptLinksBox').observe('mousemove', slideLinksEvent);
	
	var seasons = new Array();
	
	for (var i = 0; i < scriptLinks.length; i++) {
			if (scriptLinks[i].href) {
					scriptLinks[i].observe('click', loadScript);
			};
	};
	
	$('sc').style.width = (158 * 1 - 8) + 'px';
	$('s2').style.width = (158 * 7 - 8) + 'px';
	$('s1').style.width = (158 * 7 - 8) + 'px';
	$('ex').style.width = (158 * 1 - 8) + 'px';
	
	
	slideLinks();
};

function triggerMove(xDiff)
{
	canMove = true;
	// If horizontal position hasn't caught up with mouse, run every 10 ms
	if (xDiff != 0) { slideLinks(); };
	return true;
}

function slideLinksEvent(e)
{
	xCurrent = e.pointerX();
	slideLinks();
};

function slideLinks()
{
	// Can only occur every 10 ms triggered by mouse movement or time update
	if (canMove === true) {
		// Max values needed to determine movement
		var boxOffset  = $('page').positionedOffset()['left'] + $('scriptLinksBox').positionedOffset()['left'] + 40;
		var boxWidth   = $("scriptLinksBox").getWidth();
		var maxOffset  = $("scriptLinks").getWidth() - boxWidth;
		var xChange    = xCurrent - boxOffset; // 250 is the amount hamster takes up

		// X position of links based on linear equation
		var xSlide     = 20 * NUMLINKS - xChange * (40 * NUMLINKS + maxOffset) / boxWidth;

		// Create a weighted acceleration so position slowly meets mouse
		xSlide         = (xSlide + 99 * lastXSlide) / 100;

		// Event can only occur ever 10 ms and keeps occurring until X meets mouse
		canMove        = false;
		setTimeout('triggerMove(' + (xSlide - lastXSlide) + ')', 10);
		lastXSlide     = xSlide;

		// $('debug').update('boxOffset: ' + boxOffset + ', boxWidth: ' + boxWidth + ', maxOffset: ' + maxOffset + ', xChange: ' + xChange + ', xSlide: ' + xSlide);		
		
		// Clip edges so links line up with page, then update horizontal position
		// maxOffset + 12 is farthest right it can go with 12 pixel padding
		// 50 is the farthest left and accounts for edge of hamster chair
		xSlide         = Math.round(Math.max(-(maxOffset + 8), Math.min(-99, xSlide)));
		$("scriptLinks").style.left = xSlide + 'px';
	};
};

function callScript(e) {
	new Ajax.TXMRequest('scripts.php?id=' + this.id, {
		onSuccess: loadMainBox});
	
	if(e) { e.stop(); };
};

function loadMainBox(response) {
	$('mainBox').setOpacity(0.0);
	$('mainBox').update(response);
	$('mainBox').appear({duration: 0.4, afterFinish: function() {
		new Effect.ScrollTo('mainBox');
	}});
}

function hoverFooter() {
	this.setOpacity(1.0);		
};

function clearFooter() {
	this.setOpacity(0.5);		
};

function displayEpisode(e) {
	new Ajax.TXMRequest('episodes.php?id=' + this.id, {
		onSuccess: loadEpisode});
	
	if(e) { e.stop(); };	
};

function loadEpisode(response) {
	$('episodeBox').hide();
	$('episodeBox').update(response);
	
	$('epPlay').observe('click', displayVimeo);
	$('epScript').observe('click', displayLink);
	$('epWallpaper').observe('click', displayLink);
	
	$('episodeBox').appear({duration: 0.4});	
};

function displayVimeo(e) {
	new Ajax.TXMRequest(this.href, {
		onSuccess: loadVimeo});
	
	if(e) { e.stop(); };	
};

function displayLink(e) {
	new Ajax.TXMRequest(this.href, {
		onSuccess: loadMainBox});
	
	if(e) { e.stop(); };	
};

function loadVimeo(response) {
	$('vimeoBox').hide();
	$('vimeoBox').update(response);
	$('epClose').observe('click', closeVimeo);
	$('vimeoBox').appear({duration: 0.4, afterFinish: function() {
		new Effect.ScrollTo('mainBox');
	}});
	$('page').fade({duration: 0.4, from: 1.0, to: 0.2});
};

function closeVimeo() {
	$('vimeoBox').fade({duration: 0.4, afterFinish: function() {
		$('vimeoBox').update();
		$('vimeoBox').hide();
	}});
	
	$('page').appear({duration: 0.4, from: 0.2, to: 1.0});
};


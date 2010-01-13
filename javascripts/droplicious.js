/*
droplicious v.1.0 Created May 21, 2009
Copyright @2009 http://headfirstproductions.ca Author: Darren Terhune
Contributors: Jan Sovak http://canada-jack.com,  Mason Meyer http://www.masonmeyer.com
This software is licensed under the Creative Commons Attribution 2.5 Canada License 
<http://creativecommons.org/licenses/by/2.5/ca//>
*/

var dropliciousShowingUpDuration = 0.3;
var dropliciousHidingDuration = 0.1;
var dropliciousHideDelay = 0;

function dropliciousShowingUpEffect(element){
	if(!element.visible()){
		new Effect.BlindDown(element, {
			duration: dropliciousShowingUpDuration,
			queue: {
				position: 'end',
				scope: element.identify(),
				limit:2
			}
		});
	}
}

function dropliciousHidingEffect(element){
	new Effect.BlindUp(element, {
		duration: dropliciousHidingDuration,
		queue: {
			position: 'end',
			scope: element.identify(),
			limit: 2
		}
	 });
}

function setDelayedHide(element){
	element.addClassName('waitingtohide')
	if(!element.hasClassName('hidding')){
		if (!element.hasClassName('hiddingtimerset')){	
			element.addClassName('hiddingtimerset');
			setTimeout(function(){ delayedHide(element); }, dropliciousHideDelay * 1000);
		}
	}
}
function delayedHide(dropElement){
	dropElement.removeClassName('hiddingtimerset');
	if (dropElement.hasClassName('waitingtohide')){
		dropliciousHidingEffect(dropElement);
		dropElement.addClassName('hidding');
		setTimeout(
			function(){
				dropElement.removeClassName('waitingtohide');
				dropElement.removeClassName('hidding');
				dropElement.removeClassName('active');
			}, dropliciousHidingDuration * 1000);
	}
}

function linkMouseOut(id){
	var dropElement = id.element().next();		
	if (dropElement && dropElement.hasClassName('active')){
		setDelayedHide(dropElement);
	}
}
function linkMouseOver(id){
	var dropElement = id.element().next();
	if(dropElement){
		if (!dropElement.hasClassName('hidding')){
			dropElement.removeClassName('waitingtohide');
		}
		if (!dropElement.hasClassName('active')){
			dropElement.addClassName('active');
			dropliciousShowingUpEffect(dropElement);
		}
	}
}
function submenuMouseOut(event){
	var dropElement = event.findElement("ul");	
	if (dropElement && dropElement.hasClassName('active')){
		setDelayedHide(dropElement);
	}
}

function submenuMouseOver(event){
	var dropElement = event.findElement("ul");	
	if (dropElement && !dropElement.hasClassName('hidding')){
		dropElement.removeClassName('waitingtohide');
	}
}

document.observe('dom:loaded', function() {
	$$('a.drops').each(function(name) {
		name.observe('mousemove', linkMouseOver.bindAsEventListener(this));
		name.observe('mouseout',  linkMouseOut.bindAsEventListener(this));
	});

	$$('ul.scriptaculously').each(function(name){
		name.observe('mousemove', submenuMouseOver.bindAsEventListener(this));
		name.observe('mouseout',  submenuMouseOut.bindAsEventListener(this));
	});
})
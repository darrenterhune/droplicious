// Droplicious v.3.0 Created May 21, 2009
// Copyright @2009 http://headfirstproductions.ca Author: Darren Terhune
// Contributors: Jan Sovak http://canada-jack.com,  Mason Meyer http://www.masonmeyer.com
// This software is licensed under the Creative Commons Attribution 2.5 Canada License 
// <http://creativecommons.org/licenses/by/2.5/ca//>

var dropliciousMenu = Class.create({

	// Properties
	showingUpDuration: 0.3,
	hidingDuration: 0.1,
	hideDelay: 0,

	initialize: function(){
		
		$$("a.drops").invoke('observe', 'mousemove', this.linkMouseOver.bind(this));
		$$("a.drops").invoke('observe', 'mouseout', this.linkMouseOut.bind(this));
		
		$$("ul.licious").invoke('observe', 'mousemove', this.submenuMouseOver.bind(this));
		$$("ul.licious").invoke('observe', 'mouseout', this.submenuMouseOut.bind(this));
		
	},
	
	// Default Effects
	// It's possible to set user's effects handlers
	// eg: myDropliciousInstance.showUpEffect = function(){ * user's effect * };
	showUpEffect: function(e, effectDuration){
		if(!e.visible()){
			new Effect.BlindDown(e, {
				duration: effectDuration,
				queue: {
					position: 'end',
					scope: e.identify(),
					limit: 2
				}
			});
		}
	},

	hidingEffect: function(e, effectDuration){
		new Effect.BlindUp(e, {
			duration: effectDuration,
			queue: {
				position: 'end',
				scope: e.identify(),
				limit: 2
			}
		});
	},

	// Mouse event handlers
	linkMouseOut: function(e){
		var dropElement = e.element().next();		
		if (dropElement && dropElement.hasClassName('active')){
			this.setDelayedHide(dropElement);
		}
	},

	linkMouseOver: function(e){
		var dropElement = e.element().next();
		// Additional check if something wrong with menu structure
		if(!dropElement){
			return;
		}

		if (!dropElement.hasClassName('hidding')){
			dropElement.removeClassName('waitingtohide');
		}
		
		if (!dropElement.hasClassName('active')){
			dropElement.addClassName('active');
			this.showUpEffect(dropElement, this.showingUpDuration);
		}
	},

	submenuMouseOut: function(e){
		var dropElement = e.findElement("ul");	
		if (dropElement && dropElement.hasClassName('active')){
			this.setDelayedHide(dropElement);
		}
	},

	submenuMouseOver: function(e){
		var dropElement = e.findElement("ul");	
		if (dropElement && !dropElement.hasClassName('hidding')){
			dropElement.removeClassName('waitingtohide');
		}
	},

	// Delayed  methods, needed for smooth subMenu hiding
	setDelayedHide: function(e){
		e.addClassName('waitingtohide')
		if(!e.hasClassName('hidding')){
			if (!e.hasClassName('hiddingtimerset')){	
				e.addClassName('hiddingtimerset');
				(function(obj, e){ obj.delayedHide(e); }).delay(this.hideDelay, this, e);
			}
		}
	},

	delayedHide: function(e){
		e.removeClassName('hiddingtimerset');
		if (e.hasClassName('waitingtohide')){
			this.hidingEffect(e, this.hidingDuration);
			e.addClassName('hidding');
			//Changed to Prototype's API manner
			(function(e){
				e.removeClassName('waitingtohide');
				e.removeClassName('hidding');
				e.removeClassName('active');
			}).delay(this.hidingDuration, e);

		}
	}

});

document.observe('dom:loaded', function() {
	new dropliciousMenu();
})
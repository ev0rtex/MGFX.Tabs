//MGFX.Rotater. Copyright (c) 2008-2009 Sean McArthur <http://mcarthurgfx.com/>, MIT Style License.

var MGFX = MGFX || {};

MGFX.Rotater = new Class({
	
	Implements: [Options, Events],
	
	options: {
		slideInterval: 5000,
		transitionDuration: 1000,
		startIndex: 0,
		autoplay: true,
		hover:true,
		hash: true,
		onAutoPlay: $empty,
		onRotate: $empty,
		onShowSlide: $empty,
		onStop: $empty,
		onPause: $empty,
		onResume: $empty
	},
	
	initialize: function(slides,options){
		this.setOptions(options);
		this.slides = $$(slides);
		this.createFx();
		this.showSlide(this.options.startIndex);
		if(this.slides.length < 2) this.options.autoplay = false;
		if(this.options.autoplay) this.autoplay();
		if(this.options.hover) this.setupHover();
		return this;
	},
	
	createFx: function(){
		if (!this.slideFx) this.slideFx = new Fx.Elements(this.slides, {duration: this.options.transitionDuration});
		this.slides.each(function(slide){
			slide.setStyle('opacity',0);
		});
	}.protect(),
	
	setupHover: function() {
		var _timeLastRotate = new Date(),
			_timeLastPause,
			_timeTillRotate = this.options.slideInterval,
			_resumeDelay;
			
		this.addEvent('onRotate', function() {
			if(this.slideshowInt) {
				_timeLastRotate = new Date();
				_timeTillRotate = this.options.slideInterval;
			}
		});
		this.slides.addEvent('mouseenter',function() {
			this.stop();
			_timeLastPause = new Date();
			$clear(_resumeDelay);
			this.fireEvent('onPause');
		}.bind(this));
		
		this.slides.addEvent('mouseleave', function() {
			console.log(_timeLastPause - _timeLastRotate);
			var timePassed = (_timeLastPause - _timeLastRotate);
			_timeLastRotate = new Date() - timePassed;
			_resumeDelay = (function() {
				this.autoplay();
				this.rotate();
				this.fireEvent('onResume');
			}).delay(_timeTillRotate - timePassed, this);
			
		}.bind(this));
	}.protect(),
	
	showSlide: function(slideIndex){
		if(slideIndex == this.currentSlide) return this;
		var action = {};
		this.slides.each(function(slide, index){
			if(index == slideIndex && index != this.currentSlide){ //show
				action[index.toString()] = {
					opacity: 1
				};
			} else {
				action[index.toString()] = {
					opacity:0
				};
			}
		}, this);
		this.fireEvent('onShowSlide', slideIndex);
		this.currentSlide = slideIndex;
		this.slideFx.start(action);
		return this;
	},
	
	autoplay: function(){
		this.slideshowInt = this.rotate.periodical(this.options.slideInterval, this);
		this.fireEvent('onAutoPlay');
		return this;
	},
	
	stop: function(){
		$clear(this.slideshowInt);
		this.fireEvent('onStop');
		return this;
	},
	
	rotate: function(){
		var current = this.currentSlide;
		var next = (current+1 >= this.slides.length) ? 0 : current+1;
		this.showSlide(next);
		this.fireEvent('onRotate', next);
		return this;
	}

});
var MGFX = MGFX || {};

MGFX.Rotater = new Class({
	
	Implements: [Options, Events],
	
	/*
	slideInterval: Time (ms) to remain on each slide.
	transitionDuration: Time (ms) for the fade effect.
	startIndex: Which slide to start at in the animation.  Zero-based index.
	autoplay: Whether to start the rotating of the slides on load.
	hover: Allow a hover event to stop the rotating.
	*/
	options: {
		slideInterval: 4000,
		transitionDuration: 1000,
		startIndex: 0,
		autoplay: true,
		hover:true
	},
	
	initialize: function(slides,options){
		this.setOptions(options);
		this.slides = $$(slides);
		this.createFx();
		this.showSlide(this.options.startIndex);
		if(this.slides.length < 2) this.options.autoplay = false;
		if(this.options.autoplay) this.autoplay();
		if(this.options.hover) this.slides.addEvent('mouseenter',function() { this.stop(); }.bind(this));
		return this;
	},
	
	createFx: function(){
		if (!this.slideFx) this.slideFx = new Fx.Elements(this.slides, {duration: this.options.transitionDuration});
		this.slides.each(function(slide){
			slide.setStyle('opacity',0);
		});
	}.protect(),
	
	showSlide: function(slideIndex){
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
		current = this.currentSlide;
		next = (current+1 >= this.slides.length) ? 0 : current+1;
		this.showSlide(next);
		this.fireEvent('onRotate', next);
		return this;
	}

});
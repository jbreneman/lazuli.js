import isObject from 'isobject';
import 'es6-object-assign/auto';

'use strict';

function Lazuli() {
	let options = {
		className: 'lazuli',
		background: true,
		img: true,
		fancy: true,
		load: null,
		finished: null
	};

	[].slice.call(arguments).forEach((arg) => {
		if(typeof arg === 'string') options.className = arg;
		if(isObject(arg)) options = Object.assign({}, options, arg);
	});

	this.options = options;
	this.loaded = 0;
	this.init(options);
};

Lazuli.prototype = {
	//
	// Private
	//
	_load: function(image, onload) {
		const loader = document.createElement('img');
		const self = this;

		loader.addEventListener('load', function() {
			self.loaded++;
			if (typeof onload === 'function') onload(this, image);

			// Fire user defined callbacks and add loaded class
			if(typeof self.options.load === 'function') self.options.load({ image: image });
			if(self.loaded === self.total && typeof self.options.finished === 'function') self.options.finished({ image: image });
			image.classList.add('loaded');

			// Clean up this listener and dom
			this.removeEventListener('load', this);
			for (const key in Object.assign({}, image.dataset)) {
				delete image.dataset[key];
			}
		});

		for (const key in Object.assign({}, image.dataset)) {
			// Loop through dataset and move properties over to our loader
			// leaving the src property for last since we want that to go last
			if (key !== 'src') {
				loader.setAttribute(key, image.dataset[key]);
			}
		}

		// Kick off loading the image
		loader.setAttribute('src', image.dataset.src);
	},

	_createInside: function(image) {
		const styles = `
			background-image: url(${ image });
			background-position: inherit;
			background-size: inherit;
			background-repeat: inherit;
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			opacity: 0;
			transition:
			opacity .24s ease;
			z-index: -1;
		`;
		const element = document.createElement('div');
		element.classList.add('lazuli-inner');
		element.setAttribute('style', styles);

		return element;
	},

	_background: function(_this, image) {
		if (this.options.fancy) {
			let computed = window.getComputedStyle(image, null);
			if (computed.position === 'static') { image.style.position = 'relative'; }
			if (computed.zIndex === 'auto') { image.style.zIndex = '0'; }
			
			const child = this._createInside(_this.currentSrc || _this.src);
			image.appendChild(child);

			// Force a redraw
			image.firstElementChild.offsetHeight;

			image.querySelector('.lazuli-inner').style.opacity = '1';
			window.setTimeout(()=> {
				image.style.backgroundImage = 'none';
			}, 240);
		} else {
			image.style.backgroundImage = `url(${ _this.currentSrc || _this.src })`;
		}
	},

	_img: function(_this, image) {
		image.src = _this.currentSrc || _this.src;
	},

	//
	// Public
	//
	init: function(options) {
		const images = document.querySelectorAll(`.${ options.className }`);

		this.total = images.length;

		[].slice.call(images).forEach((image) => {
			if(image.tagName === 'IMG') {
				this._load(image, this._img);
			} else {
				this._load(image, this._background.bind(this));
			}
			
		});
	}
};

window.Lazuli = Lazuli;

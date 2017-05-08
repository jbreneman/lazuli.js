import 'isobject';
import 'es6-object-assign/auto';

'use strict';

function Lazuli() {
	let options = {
		className: 'lazuli',
		background: true,
		img: true
	};

	[].slice.call(arguments).forEach((arg) => {
		if(typeof arg === 'string') options.className = arg;
		if(isobject(arg)) options = Object.assign({}, options, arg);
	});

	this.options = options;
	this.init(options);
};

Lazuli.prototype = {
	//
	// Private
	//
	_load: function(image, onload) {
		const loader = document.createElement('img');

		loader.addEventListener('load', function() {
			if(typeof onload === 'function') onload(this, image);
			this.removeEventListener('load', this);
		});

		if (image.dataset.srcset !== undefined) {
			loader.setAttribute('srcset', image.dataset.srcset);
		}

		if (image.dataset.sizes !== undefined) {
			loader.setAttribute('sizes', image.dataset.sizes);
		}

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
		image.classList.add('loaded');
	},

	_img: function(_this, image) {
		image.src = _this.currentSrc || _this.src;
		image.classList.add('loaded');
	},

	//
	// Public
	//
	init: function(options) {
		const images = document.querySelectorAll(`.${ options.className }`);

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

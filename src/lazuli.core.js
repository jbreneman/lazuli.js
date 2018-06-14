import isObject from 'isobject';

'use strict';

const Lazuli = function () {
	const [ arg ] = arguments;
	let options = {
		selector: '.lazuli',
		background: true,
		img: true,
		fancy: false,
		load: null
	};

	if(typeof arg === 'string') options.selector = arg;
	if(isObject(arg)) options = Object.assign({}, options, arg);

	this.options = options;

	// Return a promise with all images once load is finished
	return new Promise((resolve, reject) => {
		this.init(options)
			.then((res) => {
				resolve(res);
			})
			.catch((err) => {
				reject(err);
			});
	});
};

Lazuli.prototype = {
	//
	// Private
	//
	_loadImage(image) {
		return new Promise((resolve, reject) => {
			const loader = document.createElement('img');

			loader.addEventListener('load', function() {
				this.removeEventListener('load', this);
				resolve(this);
			});

			loader.addEventListener('error', function() {
				this.removeEventListener('error', this);
				reject(this);
			});

			// Loop through dataset and move properties over to our loader
			// leaving the src property for last since we want that to go last
			Object.keys(image.dataset).forEach((key) => {
				if (key !== 'src') {
					loader.setAttribute(key, image.dataset[key]);
				}
			});

			// Kick off loading the image
			loader.setAttribute('src', image.dataset.src);
		});
	},

	_load(image) {
		return new Promise((resolve, reject) => {
			this._loadImage(image)
				.then((loaded)=> {

					// Fire user defined callbacks and add loaded class
					if(typeof this.options.load === 'function') this.options.load({ image: image });
					image.classList.add('loaded');

					// Clean up dom
					Object.keys(image.dataset).forEach((key) => {
						delete image.dataset[key];
					});

					return loaded;
				})
				.then((loaded) => {
					resolve(loaded);
				})
				.catch((err) => {
					reject(err);
				});
		});
	},

	_createInside(image) {
		const styles = `
			background-image: url(${image});
			background-position: inherit;
			background-size: inherit;
			background-repeat: inherit;
			position: absolute;
			width: 100%;
			height: 100%;
			left: 0;
			top: 0;
			opacity: 0;
			transition: opacity .24s ease;
			z-index: -1;
		`;
		const element = document.createElement('div');
		element.classList.add('lazuli-inner');
		element.setAttribute('style', styles);

		return element;
	},

	_background(image, loaded) {
		if (this.options.fancy) {
			const computed = window.getComputedStyle(image, null);
			if (computed.position === 'static') { image.style.position = 'relative'; }
			if (computed.zIndex === 'auto') { image.style.zIndex = '0'; }

			const child = this._createInside(loaded.currentSrc || loaded.src);
			image.appendChild(child);

			// Force a redraw
			image.firstElementChild.offsetHeight;

			image.querySelector('.lazuli-inner').style.opacity = '1';
			image.style.filter = '';

			window.setTimeout(() => {
				image.style.backgroundImage = 'none';
			}, 240);
		} else {
			image.style.backgroundImage = `url(${ loaded.currentSrc || loaded.src })`;
		}
	},

	//
	// Public
	//
	init(options) {
		const images = document.querySelectorAll(options.selector);
		const loaded = [];

		// Convert images domlist to array and fire off load requests
		[...images].forEach((image) => {
			let shown = true;

			// Turn off specific types based on options
			if (image.tagName === 'IMG') shown = options.img;
			if (image.tagName !== 'IMG') shown = options.background;

			if (shown) {
				if (this.options.fancy) {
					image.style.filter = 'blur(3px)';
				}

				// Push all promises into an array so we can watch when all are finished
				loaded.push(this._load(image)
					.then((loaded) => {
						if(image.tagName === 'IMG') {
							image.src = loaded.currentSrc || loaded.src;
							image.style.filter = '';
						} else {
							this._background(image, loaded);
						}
					})
					.catch((err) => {
						console.error('Failed to load image: ', err);
					})
				);
			}
		});

		return new Promise((resolve, reject) => {
			// Return a promise to the main lazuli function
			Promise.all(loaded)
				.then(res => {
					resolve({ images: [...images] });

				})
				.catch(err => {
					console.error('Some images failed to load', err);
					reject(({ images: [...images] }));
				});
		});
	}
};

export default Lazuli;
'use strict';

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

var isobject = function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
};

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var Lazuli = function Lazuli() {
	var _this = this;

	var _arguments = Array.prototype.slice.call(arguments),
	    arg = _arguments[0];

	var options = {
		selector: '.lazuli',
		background: true,
		img: true,
		fancy: false,
		load: null
	};

	if (typeof arg === 'string') options.selector = arg;
	if (isobject(arg)) options = Object.assign({}, options, arg);

	this.options = options;

	// Return a promise with all images once load is finished
	return new Promise(function (resolve, reject) {
		_this.init(options).then(function (res) {
			resolve(res);
		}).catch(function (err) {
			reject(err);
		});
	});
};

Lazuli.prototype = {
	//
	// Private
	//
	_loadImage: function _loadImage(image) {
		return new Promise(function (resolve, reject) {
			var loader = document.createElement('img');

			loader.addEventListener('load', function () {
				this.removeEventListener('load', this);
				resolve(this);
			});

			loader.addEventListener('error', function () {
				this.removeEventListener('error', this);
				reject(this);
			});

			// Loop through dataset and move properties over to our loader
			// leaving the src property for last since we want that to go last
			Object.keys(image.dataset).forEach(function (key) {
				if (key !== 'src') {
					loader.setAttribute(key, image.dataset[key]);
				}
			});

			// Kick off loading the image
			loader.setAttribute('src', image.dataset.src);
		});
	},
	_load: function _load(image) {
		var _this2 = this;

		return new Promise(function (resolve, reject) {
			_this2._loadImage(image).then(function (loaded) {

				// Fire user defined callbacks and add loaded class
				if (typeof _this2.options.load === 'function') _this2.options.load({ image: image });
				image.classList.add('loaded');

				// Clean up dom
				for (var key in [].concat(toConsumableArray(image.dataset))) {
					delete image.dataset[key];
				}

				return loaded;
			}).then(function (loaded) {
				resolve(loaded);
			}).catch(function (err) {
				reject(err);
			});
		});
	},
	_createInside: function _createInside(image) {
		var styles = '\n\t\t\tbackground-image: url(' + image + ');\n\t\t\tbackground-position: inherit;\n\t\t\tbackground-size: inherit;\n\t\t\tbackground-repeat: inherit;\n\t\t\tposition: absolute;\n\t\t\twidth: 100%;\n\t\t\theight: 100%;\n\t\t\tleft: 0;\n\t\t\ttop: 0;\n\t\t\topacity: 0;\n\t\t\ttransition: opacity .24s ease;\n\t\t\tz-index: -1;\n\t\t';
		var element = document.createElement('div');
		element.classList.add('lazuli-inner');
		element.setAttribute('style', styles);

		return element;
	},
	_background: function _background(image, loaded) {
		if (this.options.fancy) {
			var computed = window.getComputedStyle(image, null);
			if (computed.position === 'static') {
				image.style.position = 'relative';
			}
			if (computed.zIndex === 'auto') {
				image.style.zIndex = '0';
			}

			var child = this._createInside(loaded.currentSrc || loaded.src);
			image.appendChild(child);

			// Force a redraw
			image.firstElementChild.offsetHeight;

			image.querySelector('.lazuli-inner').style.opacity = '1';
			image.style.filter = '';

			window.setTimeout(function () {
				image.style.backgroundImage = 'none';
			}, 240);
		} else {
			image.style.backgroundImage = 'url(' + (loaded.currentSrc || loaded.src) + ')';
		}
	},


	//
	// Public
	//
	init: function init(options) {
		var _this3 = this;

		var images = document.querySelectorAll(options.selector);
		var loaded = [];

		// Convert images domlist to array and fire off load requests
		[].concat(toConsumableArray(images)).forEach(function (image) {
			var shown = true;

			// Turn off specific types based on options
			if (image.tagName === 'IMG') shown = options.img;
			if (image.tagName !== 'IMG') shown = options.background;

			if (shown) {
				if (_this3.options.fancy) {
					image.style.filter = 'blur(3px)';
				}

				// Push all promises into an array so we can watch when all are finished
				loaded.push(_this3._load(image).then(function (loaded) {
					if (image.tagName === 'IMG') {
						image.src = loaded.currentSrc || loaded.src;
						image.style.filter = '';
					} else {
						_this3._background(image, loaded);
					}
				}).catch(function (err) {
					console.error('Failed to load image: ', err);
				}));
			}
		});

		return new Promise(function (resolve, reject) {
			// Return a promise to the main lazuli function
			Promise.all(loaded).then(function (res) {
				resolve({ images: [].concat(toConsumableArray(images)) });
			}).catch(function (err) {
				console.error('Some images failed to load', err);
				reject({ images: [].concat(toConsumableArray(images)) });
			});
		});
	}
};

module.exports = Lazuli;

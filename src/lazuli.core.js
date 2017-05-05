import 'isobject';

'use strict';

let defined = false;

if (typeof Lazuli !== 'undefined') {
	console.error('Error: Lazuli is already defined.');
	defined = true;
}

const Lazuli = function() {
	if (typeof arguments[0] === '') {
		
	}
};

Lazuli.prototype = {

};

if(!defined) {
	window.Lazuli = Lazuli;
}

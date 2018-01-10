# Lazuli

Lazuli is a promise based image lazyloader that works for both images and background images.

## Installation

`npm i -S lazuli-js` or `yarn add lazuli-js`.

## Usage

ES modules: `import Lazuli from 'lazuli-js';`
CJS modules: `var Lazuli = require('lazuli-js');`
Global: Make sure it's getting included in your build somehow, then use as normal.

There are 3 different files being built, CommonJS, ES6 module, and UMD. You may need to tell your bundler to grab the right file if you're running into import issues.

### In your HTML

Lazuli uses data attributes in place of actual attributes. Basically, take the normal attribute you would normally use and slap a `data-` in front of it and you're good to go. Lazuli supports all responsive images attributes as long as they're supported by the browser.

```
<img class="lazuli" data-src="image.jpg" alt="Basic example">

<img class="lazuli" data-src="image.jpg" data-srcset="image-200.jpg 200w, image-400.jpg 400w, image-800.jpg 800w" data-sizes="(max-width: 680px) 100vw, 50vw" alt="Srcset and sizes!">
```

Lazuli also supports background images using the exact same syntax, so this will just work:

```
<div class="lazuli" data-src="image.jpg">
	This div will lazyload image.jpg as a background image.
</div>
```

Lazuli tries to stay out of the way of your styles, meaning you'll need to set things like background-size like you would normally.

### In your Javascript

Kicking off Lazuli is as simple as:

```
const lazy = new Lazuli();
```

By default it looks for the class `lazuli` but you can also pass in a selector as a string:

```
const lazy = new Lazuli('.lazy, .lazy-bg');
```

You can also pass in an options object for more control over what happens:

```
const lazy = new Lazuli({
	selector: '.lazy, .lazy-bg',
	background: false
});
```

Lazuli returns a promise that resolves once every image is loaded. You can use this to kick off other things once images are loaded or sequentially load groups of images:

```
new Lazuli('.primary-images').then((res) => {
	return new Lazuli('.secondary-images');
}).then((res) => {
	return new Lazuli('.tertiary-images');
}).catch((err) => {
	console.log('Whoops, something didn't load!', err);
});
```

## Available options

```
{
	selector: '.lazuli',
	background: true,
	img: true,
	fancy: false,
	load: null
}
```

#### selector

Expects a string formatted as a css selector. Uses querySelectorAll internally, so it should be able to deal with pretty much everything.

#### background, img

Expects a boolean. Setting background to false means it will only look for <img> tags, and setting img to false means it only looks for non-<img> tags. Setting both to false is just silly. ;)

#### fancy

Background images currently support a fancy fade in animation (think medium.com headers). This is still a little experimental—it currently works pretty well but sometimes will break things since it injects it's own <div> inside the element you attach it to. Highly recommend giving it a shot though! Adding more configuration for this is in the roadmap.

#### load

Callback that runs each time an image is loaded. Returns an object with data:

```
{
	image: <Element>
}
```

#### finished

Callback that runs when all images have loaded. Returns an object with data:

```
{
	images: [<Element>, <Element>]
}
```

## Contributing

Submit a PR!

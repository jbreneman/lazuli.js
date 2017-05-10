# Lazuli

Lazuli is a ES6 rewrite/mashup of lazzyload and a lazyload module for background images I've been working on using tons of cool stuff because we can.

## Installation

Currently Lazuli supports being used as a global object, and _should_ support ES6 and commonjs modules as well.

### How to install

Copy `lazuli.min.js` from /dist into your project, preferably into a /libs folder.

## Usage

### In your HTML

Lazuli uses data attributes in place of actual attributes. Basically, take the normal attribute you would normally use and slap a `data-` in front of it and you're good to go. Lazuli supports all responsive images attributes as long as they're supported by the browser.

```
<img class="lazuli" data-src="image.jpg" alt="Basic example">

<img class="lazuli" data-src="image.jpg" srcset="image-200.jpg 200w, image-400.jpg 400w, image-800.jpg 800w" sizes="(max-width: 680px) 100vw, 50vw" alt="Srcset and sizes!">
```

Lazuli also supports background images using the exact same syntax, so this will just work:

```
<div class="lazuli" data-src="image.jpg">
	This div will lazyload image.jpg as a background image.
</div>
```

Lazuli trys to stay out of the way of your styles, meaning you'll need to set things like background-size like you would normally.

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

## Available options

```
{
	selector: '.lazuli',
	background: true,
	img: true,
	fancy: false,
	load: null,
	finished: null
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

Submit a PR and tag Jesse. :)

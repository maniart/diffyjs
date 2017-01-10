#Diffy.js
### A dependency-free motion detection library for the browser.
This library came out of my [browser-based interactive experiments](http://mani.io/portfolio/the-night/) and from the need to extract motion data from the webcam through the `getUserMedia` API. This is the cleaned up version of that code. Hat tip to [Soundstep](http://www.soundstep.com/blog/2012/03/22/javascript-motion-detection/) for the technique used in this library.

## Overview
Basically, Diffy.js grabs two consecutive webcam snapshots in each tick of the loop (via `requestAnimationFrame`) & combines them into a high contrast blended image to create a "diff image".  This image can be adjusted from the API via `sensitivity` and `threshold` parameters. Based on a `resolution: {x, y}` parameter from the API, Diffy.js will create a matrix containing average values from this image. This matrix is then passed as the only argument to a recursively-executed callback function provided by the user: `onFrame: function(matrix) { /* draw something */ }`. A Web Worker is used to speed up image processing. A simple visual debugger can be optionally turned on as you experiment with values.

<img src="https://raw.githubusercontent.com/maniart/diffyjs/master/screenshot.jpg" width="752" height="482" />

<sup>_Screenshot from `demo/`: Raw webcam input, Mirrored raw canvas, "diff" image canvas, a simple canvas experiment with Diffy.js_</sup>


## Installation
npm: `npm install diffyjs --save`

Bower: `bower install diffyjs --save`

Git: `git clone https://github.com/maniart/diffyjs.git`


## Usage

With ES2015 via [Babel](http://babeljs.io/):

```js
import { create } from 'diffyjs';

const diffy = create({
  resolution: { x: 15, y: 10 },
  sensitivity: 0.2,
  threshold: 25,
  debug: true,
  containerClassName: 'my-diffy-container',
  sourceDimensions: { w: 130, h: 100 },
  onFrame: (matrix) => { /* good things */ }
});
```

With ES5 via `<script>` tag:

```html
<!-- HTML: -->
<script src="/path/to/diffy.min.js"></script>
```
```js
// JS:
var diffy = Diffy.create({
  resolution: { x: 15, y: 10 },
  sensitivity: 0.2,
  threshold: 25,
  debug: true,
  containerClassName: 'my-diffy-container',
  sourceDimensions: { w: 130, h: 100 },
  onFrame: function (matrix) { /* good things */ }
});
```

## A few things to keep in mind
- Diffy.js is meant to be used in a Browser environment
- The library will request camera access upon loading of the web page. Choose `Allow` to proceed.
- It also requires [Web Workers](http://caniuse.com/#search=web%20worker).
- Any hosted project using the `getUserMedia` API (including Diffy.js), [must be served over `HTTPS`](http://stackoverflow.com/questions/34197653/getusermedia-in-chrome-47-without-using-https), but you can easily run it on `localhost`.
- Diffy.js is designed to allow 1 instance on each page. Further instantiation attempts will throw.




## API Reference

#### #create(options)
Creates and returns a Diffy.js instance. It will request camera access as soon as the web page loads and will immediately begin executing the provided callback function.

#####Arguments

- **options** (object)
	- **resolution** (object) [default: `{x: 10, y: 5}`] - defines the size of the output matrix
		- x (number) [default: `10`] - resolution along the X axis
		- y (number) [default: `5`] - resolution along the Y axis
	- **sensitivity** (number) [default: `0.2`] - a decimal value between 0 and 1. It impacts the contrast of the blended image. Somewhere around 0.2 is usually good. yay magic numbers!
	- **threshold** (number) [default: `21`] - any number between 0 and 255 can be used. But _ahem_ magic numbers are around 20 and 25. Experiment with this. This parameter defines the minimum average value that registers as "movement" for Diffy.js)
    - **debug** (boolean) [default: `false`] - hides or shows the debug view. Please note that to work with video and pixel data, Diffy.js *will* add a few DOM nodes & a minimal `style` tag to your page. However, they are hidden unless `debug` flag is set to `true`.
    - **sourceDimensions** (object) [default: `{x: 130, h: 100}`] - defines the dimensions for the source frame. Keep in mind that the larger the dimensions, the more pixels Diffy.js needs to examine, hence the lower the performance.
    	-  x (number) [default: `130`] - width of the source frame
    	-  y (number) [default: `100`] - height of the source frame
    - **containerClassName** (string) [default: `diffy--debug-view`] - defines the class name for the container element that wraps around Diffy.js debug view. Debug view is hidden by default, unless the `debug` flag is set to `true`.
    - **onFrame** (function) [default: `() => {}`] - callback function executed recursively at each tick of the loop by Diffy.js via `requestAnimationFrame` API. Diffy.js provides this function with the motion matrix as the only argument.


## Development
This project uses Node.js `v6.9.1`, Babel `v6.18.0` and Webpack `v1.13.2`.
After cloning the repo, install the dev dependencies from the project root via `npm install`.
At this point, you should be able to run `npm start` to start the development server at `http://localhost:3000`.
`npm start` will watch source files in `src` for changes, recompiles the changes files and serves them from the memory. In order to produce build artifacts, run `npm run build`. This will output the build files and source maps in `dist/` and `demo/dist`

## Demo
To run the demo included in the project:

- Run `npm install` to install the required npm packages.
- Run `npm run demo` from the project root. This script will create build artifacts in `dist/` and `demo/dist` and start a demo server at `http://localhost:4000`.
- Direct your browser to `http://localhost:4000`

## Tests

As of right now, test coverage is [___*covers face*___] embarrassingly low but you can run them via `npm run test` from the project root. New releases will include better test coverage.

## Contribute

Contributions / comments much welcome! [Open a Pull Request](https://github.com/maniart/diffyjs/pulls) and lets work together?

## Issues
Please report issues [here](https://github.com/maniart/diffyjs/issues).

## License

MIT. See LICENSE

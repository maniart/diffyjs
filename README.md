![Diffy.js](./logo.png =400x141)

### A dependency-free motion detection library for the browser. 
This library came out of my [browser-based interactive experiments](http://maniartstudio.com/#the-night) and from the need to extract motion data from the webcam through the `getUserMedia` API. This is the cleaned up version of that code. Hat tip to [Soundstep](http://www.soundstep.com/blog/2012/03/22/javascript-motion-detection/) for the technique used in this library.	

## Overview
Basically, Diffy.js grabs two consectives webcam snapshots in each tick of the loop (via `requestAnimationFrame`) & combines them into a high contrast blended image to create a "diff image".  This image can be adjusted from the API via `sensitivity` and `threshold` parameters. Based on a `resolution: {x, y}` parameter from the API, Diffy.js will create a matrix containing average values from this image. This matrix is then passed as the only argument to a recursively-executed callback function provided by the user: `onFrame: function(matrix) { /* draw something */ }`. A Web Worker is used to speed up image processing. A simple visual debugger can be optionally turned on as you experiment with values. 

![Debug Screenshot](./screenshot.jpg =750x482)

_Screenshot from `demo/:` Raw webcam input, Mirrored raw canvas, "diff" image canvas, a simple canvas experiment with Diffy.js_

## Usage

If using es2015 ala [Babel](http://babeljs.io/)


## Installation
Using npm:

`npm install diffyjs --save`

Using bower:

`bower install diffyjs --save`

You can also use git:


## Development

## API Reference

Depending on the size of the project, if it is small and simple enough the reference docs can be added to the README. For medium size to larger projects it is important to at least provide a link to where the API reference docs live.

## Tests

Describe and show how to run the tests with code examples.

## Contributors

Let people know how they can dive into the project, include important links to things like issue trackers, irc, twitter accounts if applicable.

## License

A short snippet describing the license (MIT, Apache, etc.)
#Diffy.js
###A standalone motion detection library for the browser
todo

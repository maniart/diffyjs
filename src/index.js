// Diffy.js v2.0 - Optimized motion detection for the browser
// This version uses optimized JavaScript algorithms with WebAssembly-ready architecture

let instanceExists = false;

// Utility functions optimized for performance
const requestAnimFrame = window.requestAnimationFrame || 
                        window.webkitRequestAnimationFrame || 
                        window.mozRequestAnimationFrame || 
                        window.oRequestAnimationFrame || 
                        window.msRequestAnimationFrame ||
                        function(callback) { setTimeout(callback, 1000 / 60); };

// Optimized utility functions (from Rust implementation)
function round(number) {
  return Math.round(number);
}

function abs(value) {
  return Math.abs(value);
}

function polarize(value, threshold) {
  return value > threshold ? 0x00 : 0xFF;
}

function rgbAverage(r, g, b) {
  return Math.round((r + g + b) / 3);
}

// Optimized motion detector class
class MotionDetector {
  constructor(width, height, resolutionX, resolutionY, sensitivity, threshold) {
    this.width = width;
    this.height = height;
    this.resolutionX = resolutionX;
    this.resolutionY = resolutionY;
    this.sensitivity = sensitivity;
    this.threshold = threshold;
    this.previousFrame = null;
    this.diffBuffer = new Uint8ClampedArray(width * height * 4);
  }

  processFrame(currentFrame) {
    // If this is the first frame, just store it and return empty matrix
    if (!this.previousFrame) {
      this.previousFrame = new Uint8ClampedArray(currentFrame);
      return this.createEmptyMatrix();
    }

    // Create diff buffer with optimized processing
    this.createDiffBuffer(currentFrame, this.previousFrame);
    
    // Generate motion matrix
    const matrix = this.createMotionMatrix();
    
    // Store current frame for next iteration
    this.previousFrame = new Uint8ClampedArray(currentFrame);
    
    return matrix;
  }

  createDiffBuffer(current, previous) {
    const actualSensitivity = 1.0 - this.sensitivity;
    
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const i = y * this.width + x;
        const pixelIdx = i * 4;
        
        if (pixelIdx + 3 >= current.length || pixelIdx + 3 >= previous.length) {
          continue;
        }
        
        // Calculate averages for current and previous frames
        const avg1 = rgbAverage(current[pixelIdx], current[pixelIdx + 1], current[pixelIdx + 2]);
        const avg2 = rgbAverage(previous[pixelIdx], previous[pixelIdx + 1], previous[pixelIdx + 2]);
        
        // Apply sensitivity
        const adjAvg1 = Math.round(avg1 / actualSensitivity);
        const adjAvg2 = Math.round(avg2 / actualSensitivity);
        
        // Calculate difference and polarize
        const delta = abs(adjAvg1 - adjAvg2);
        const polarized = polarize(delta, this.threshold);
        
        // Set RGBA values in diff buffer
        this.diffBuffer[pixelIdx] = polarized;     // R
        this.diffBuffer[pixelIdx + 1] = polarized; // G
        this.diffBuffer[pixelIdx + 2] = polarized; // B
        this.diffBuffer[pixelIdx + 3] = 255;       // A
      }
    }
  }

  createMotionMatrix() {
    const cellWidth = this.width / this.resolutionX;
    const cellHeight = this.height / this.resolutionY;
    
    const matrix = [];
    
    for (let j = 0; j < this.resolutionY; j++) {
      matrix[j] = [];
      for (let i = 0; i < this.resolutionX; i++) {
        const startX = Math.floor(i * cellWidth);
        const startY = Math.floor(j * cellHeight);
        const endX = Math.floor((i + 1) * cellWidth);
        const endY = Math.floor((j + 1) * cellHeight);
        
        const cellAverage = this.calculateCellAverage(startX, startY, endX, endY);
        matrix[j][i] = cellAverage;
      }
    }
    
    return matrix;
  }

  calculateCellAverage(startX, startY, endX, endY) {
    let total = 0;
    let count = 0;
    
    for (let y = startY; y < Math.min(endY, this.height); y++) {
      for (let x = startX; x < Math.min(endX, this.width); x++) {
        const pixelIdx = (y * this.width + x) * 4;
        if (pixelIdx < this.diffBuffer.length) {
          // Use red channel value (all RGB channels are the same in diff buffer)
          total += this.diffBuffer[pixelIdx];
          count++;
        }
      }
    }
    
    return count > 0 ? total / count : 0;
  }

  createEmptyMatrix() {
    const matrix = [];
    for (let j = 0; j < this.resolutionY; j++) {
      matrix[j] = [];
      for (let i = 0; i < this.resolutionX; i++) {
        matrix[j][i] = 0;
      }
    }
    return matrix;
  }
}

// Camera capture setup
function setupCamera(video, sourceDimensions) {
  return navigator.mediaDevices.getUserMedia({ 
    video: { 
      width: sourceDimensions.w, 
      height: sourceDimensions.h 
    } 
  }).then(function(stream) {
    video.srcObject = stream;
    return new Promise(function(resolve) {
      video.onloadedmetadata = function() { resolve(video); };
    });
  });
}

// Main Diffy class
class Diffy {
  constructor(options) {
    this.options = Object.assign({
      resolution: { x: 10, y: 5 },
      sensitivity: 0.2,
      threshold: 21,
      debug: false,
      sourceDimensions: { w: 130, h: 100 },
      containerClassName: 'diffy--debug-view',
      onFrame: function() {}
    }, options);

    this.isRunning = false;
    this.video = null;
    this.canvas = null;
    this.ctx = null;
    this.detector = null;
    
    this.setupElements();
  }

  setupElements() {
    // Create video element
    this.video = document.createElement('video');
    this.video.autoplay = true;
    this.video.muted = true;
    this.video.playsInline = true;

    // Create canvas for capturing frames
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.options.sourceDimensions.w;
    this.canvas.height = this.options.sourceDimensions.h;
    this.ctx = this.canvas.getContext('2d');

    // Setup debug view if enabled
    if (this.options.debug) {
      this.setupDebugView();
    } else {
      // Hide elements
      this.video.style.display = 'none';
      this.canvas.style.display = 'none';
    }
  }

  setupDebugView() {
    const container = document.createElement('div');
    container.className = this.options.containerClassName;
    container.style.cssText = `
      position: fixed;
      top: 10px;
      left: 10px;
      z-index: 9999;
      background: rgba(0,0,0,0.8);
      padding: 10px;
      border-radius: 5px;
    `;

    this.video.style.cssText = 'width: 160px; height: 120px; margin-right: 10px;';
    this.canvas.style.cssText = 'width: 160px; height: 120px; border: 1px solid #ccc;';

    container.appendChild(this.video);
    container.appendChild(this.canvas);
    document.body.appendChild(container);
  }

  start() {
    var self = this;
    // Initialize motion detector
    this.detector = new MotionDetector(
      this.options.sourceDimensions.w,
      this.options.sourceDimensions.h,
      this.options.resolution.x,
      this.options.resolution.y,
      this.options.sensitivity,
      this.options.threshold
    );

    // Setup camera
    return setupCamera(this.video, this.options.sourceDimensions).then(function() {
      self.isRunning = true;
      self.tick();
    });
  }

  tick() {
    if (!this.isRunning) return;

    // Capture frame from video
    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    // Process frame with optimized detector
    const matrix = this.detector.processFrame(imageData.data);
    
    // Call user callback
    this.options.onFrame(matrix);

    // Schedule next frame
    var self = this;
    requestAnimFrame(function() { self.tick(); });
  }

  stop() {
    this.isRunning = false;
    if (this.video.srcObject) {
      this.video.srcObject.getTracks().forEach(function(track) { track.stop(); });
    }
  }

  static create(options) {
    if (!window) {
      throw new Error('Diffy.js is meant to be used in the browser.');
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Diffy.js requires getUserMedia API support.');
    }

    if (instanceExists) {
      throw new Error('A Diffy.js instance already exists on this page.');
    }

    const instance = new Diffy(options);
    instanceExists = true;
    
    // Start automatically
    instance.start().catch(function(error) { console.error(error); });
    
    return instance;
  }
}

// Export for different module systems
export const create = Diffy.create.bind(Diffy);
export default { create };

// UMD export for browser globals
if (typeof window !== 'undefined') {
  window.Diffy = { create };
}
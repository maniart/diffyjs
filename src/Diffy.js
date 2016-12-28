/*
  TODO worker error handling
*/

import Worker from 'worker-loader?inline!./worker';
import { createOnceLog, $ } from './utils';

// tmp
const logger_1 = createOnceLog();
const logger_2 = createOnceLog();

export default class Diffy {
  constructor({
    tickFn = () => {},
    captureFn = () => {},
    captureConfig = {
      audio: false,
      video: {
        width: 130,
        height: 100
      }
    },
    debug = false,
    sourceDimensions = { w: 130, h: 100 },
    onTick = (values) => {},
    onMotion = (values) => {},
    sensitivity = 0.5,
    containerClassName = 'diffy--debug-view',
    resolution = { x: 10, y: 5 }
  }) {


    this.tickFn = tickFn.bind(window);
    this.captureFn = captureFn;

    this.currentImageData = null;
    this.previousImageData = null;

    this.resolutionX = resolution.x;
    this.resolutionY = resolution.y;

    this.sensitivity = sensitivity;

    this.debug = debug;
    this.containerClassName = containerClassName;
    this.debugViewCollapsed = false;

    this.captureConfig = captureConfig;

    this.sourceWidth = sourceDimensions.w;
    this.sourceHeight = sourceDimensions.h;

    this.worker = new Worker;

    this.initialized = false;

    window.addEventListener('load', this.init.bind(this));
  }

  static instanceExists = false;
  static VERSION = '1.0.0';

  toVideo(blob, videoEl) {
    // piping blob to video element
    videoEl.src = blob;
  }

  toCanvas(video, canvas) {
    // piping video to canvas
    canvas
      .getContext('2d')
      .drawImage(video, 0, 0, canvas.width, canvas.height);
  }


  mirror(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    return canvas;
  }

  compare(frame1, frame2) {
    // const length = frame1.length;

    const data1 = frame1.data;
    const data2 = frame2.data;
    const length = data1.length;

    const buffer = new ArrayBuffer(length);
    this.worker.postMessage({
      buffer,
      data1,
      data2,
      sensitivity: this.sensitivity,
      width: this.sourceWidth,
      height: this.sourceHeight
    });

  }

  drawBlendImageFromBuffer(buffer) {
    this.blendImageData
      .data
      .set(
        new Uint8ClampedArray(buffer)
      );

    this.blendCanvasCtx.putImageData(this.blendImageData, 0, 0);
    this.previousImageData = this.currentImageData;
  }

  /*
    blend two consecutive frames
    returns imageData
  */
  blend(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    this.currentImageData = ctx.getImageData(0, 0, width, height);
    this.previousImageData = this.previousImageData || ctx.getImageData(0, 0, width, height);
    this.compare(this.currentImageData, this.previousImageData);
  }

  loop() {
    this.toCanvas(this.videoEl, this.rawCanvasEl);
    this.blend(this.rawCanvasEl);
    this.tickFn(this.loop.bind(this));
  }

  init() {
    this.worker.addEventListener('message', ({ data }) => {
      this.drawBlendImageFromBuffer(data);
    });

    this.initDom(this.containerClassName);
    this.blendCanvasCtx = this.blendCanvasEl.getContext('2d');
    this.blendImageData = this.blendCanvasCtx.getImageData(0, 0, this.sourceWidth, this.sourceHeight);

    this.captureFn(this.captureConfig).then((blob) => {
      [this.rawCanvasEl, this.blendCanvasEl].forEach(this.mirror);
      this.toVideo(blob, this.videoEl);
      this.loop();
    });
    this.initialized = true;
  }

  createElements(containerClassName) {
    this.containerEl = document.createElement('div');
    this.containerEl.className = containerClassName;

    this.videoEl = document.createElement('video');
    this.videoEl.className = 'video view';
    this.videoEl.setAttribute('autoplay', '');
    this.videoEl.width = this.sourceWidth;
    this.videoEl.height = this.sourceHeight;

    this.rawCanvasEl = document.createElement('canvas');
    this.rawCanvasEl.className = 'canvas--raw view';
    this.rawCanvasEl.width = this.sourceWidth;
    this.rawCanvasEl.height = this.sourceHeight;

    this.blendCanvasEl = document.createElement('canvas');
    this.blendCanvasEl.className = 'canvas--blend view';
    this.blendCanvasEl.width = this.sourceWidth;
    this.blendCanvasEl.height = this.sourceHeight;

    this.headerEl = document.createElement('header');
    this.headerEl.className = 'header';

    this.titleEl = document.createElement('h1');
    this.titleEl.className = 'title';
    this.titleEl.innerText = 'Diffy debug view';

    this.toggleEl = document.createElement('span');
    this.toggleEl.className = 'toggle';
    this.toggleEl.innerText = '-';

    this.headerEl.addEventListener('click', (ev) => {
      ev.preventDefault();
      [this.videoEl, this.rawCanvasEl, this.blendCanvasEl].forEach((el) => {
        if (this.debugViewCollapsed) {
          el.classList.remove('hidden');
          this.toggleEl.innerText = '-';
        } else {
          el.classList.add('hidden');
          this.toggleEl.innerText = '+';
        }
      });
      this.debugViewCollapsed = !this.debugViewCollapsed;
    });

    this.headerEl.appendChild(this.toggleEl);
    this.headerEl.appendChild(this.titleEl);

    this.containerEl.appendChild(this.headerEl);
    this.containerEl.appendChild(this.videoEl);
    this.containerEl.appendChild(this.rawCanvasEl);
    this.containerEl.appendChild(this.blendCanvasEl);

    document.body.appendChild(this.containerEl);
  }

  injectCssStyles() {
    const node = document.createElement('style');
    const containerClassName = this.containerClassName;
    const styles = `
      .${containerClassName} {
        position: fixed;
        top: 0;
        left: 0;
        font-family: monospace;
        background-color: #000;
        border: 4px solid #000;
        color: #fff;
      }
      .${containerClassName} .header {
        width: 100%;
        background-color: #000;
        font-size: 16px;
        cursor: pointer;
      }
      .${containerClassName} .title {
        display: inline;
        margin-left: 10px;
        font-weight: 100;
        font-size: 16px;
      }
      .${containerClassName} .toggle {
        padding: 5px;
      }

      .${containerClassName} .view {
        padding: 5px;
      }

      .${containerClassName} .view.hidden {
        display: none;
      }

    `;
    node.innerHTML = styles;
    document.body.appendChild(node);
  }

  initDom(containerClassName) {
    this.createElements(containerClassName);
    this.injectCssStyles();

  }

  static create(options) {
    if (Diffy.instanceExists) {
      throw new Error(`
        Yikes! It seems like a Diffy.js instance already exists on this page. :|
        For more info, see: https://github.com/maniart/diffyjs/blob/master/README.md
      `);
    }

    Diffy.instanceExists = true;
    return new this(options);
  }
}

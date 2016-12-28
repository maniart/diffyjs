import Worker from 'worker-loader?inline!./worker';

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

    this.captureConfig = captureConfig;

    this.sourceWidth = sourceDimensions.w;
    this.sourceHeight = sourceDimensions.h;

    this.worker = new Worker;

    this.initialized = false;


    // console.log('tickFn: ', this.tickFn);
    // console.log('captureFn: ', this.captureFn);
    // console.log('debug: ', this.debug);
    // console.log('className: ', this.containerClassName);
    // console.log('resolution: ', this.resolutionX, this.resolutionY);



    window.addEventListener('load', this.init.bind(this));

  }

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
    const length = frame1.length;
    const data1 = frame1.data;
    const data2 = frame2.data;

    const buffer = new ArrayBuffer(length);
    // console.log(this.sourceWidth, this.sourceHeight);
    this.worker.postMessage({
      buffer,
      data1,
      data2,
      sensitivity: this.sensitivity,
      width: this.sourceWidth,
      height: this.sourceHeight
    });

  }

  drawBlendImage({ data }) {

    this.blendImageData
      .data
      .set(
        new Uint8ClampedArray(data)
      );
    // console.log(this.blendImageData);
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
    console.log('DOM ready. Init...');

    // this.worker.addEventListener('message', this.drawBlendImage);
    this.worker.addEventListener('message', this.drawBlendImage.bind(this));


    this.createElements(this.containerClassName);
    this.blendCanvasCtx = this.blendCanvasEl.getContext('2d');
    this.blendImageData = this.blendCanvasCtx.getImageData(0, 0, this.sourceWidth, this.sourceHeight);

    this.captureFn(this.captureConfig).then((blob) => {
      [this.rawCanvasEl, this.blendCanvasEl].forEach(this.mirror);
      this.toVideo(blob, this.videoEl);
      this.loop();
    });
    this.worker.postMessage({bar: 'foo'});
    this.initialized = true;
  }

  createElements(containerClassName) {
    this.containerEl = document.createElement('div');
    this.containerEl.className = containerClassName;

    this.videoEl = document.createElement('video');
    this.videoEl.className = 'debug--video';
    this.videoEl.setAttribute('autoplay', '');
    this.videoEl.width = this.sourceWidth;
    this.videoEl.height = this.sourceHeight;

    this.rawCanvasEl = document.createElement('canvas');
    this.rawCanvasEl.className = 'debug--raw-canvas';
    this.rawCanvasEl.width = this.sourceWidth;
    this.rawCanvasEl.height = this.sourceHeight;

    this.blendCanvasEl = document.createElement('canvas');
    this.blendCanvasEl.className = 'debug--blend-canvas';
    this.blendCanvasEl.width = this.sourceWidth;
    this.blendCanvasEl.height = this.sourceHeight;


    this.headerEl = document.createElement('div');
    this.headerEl.className = 'debug--header';

    this.titleEl = document.createElement('h6');
    this.titleEl.className = 'debug--title';
    this.titleEl.innerText = 'Diffy debug view';

    this.toggleEl = document.createElement('span');
    this.toggleEl.innerText = '-';

    this.headerEl.appendChild(this.toggleEl);
    this.headerEl.appendChild(this.titleEl);

    this.containerEl.appendChild(this.headerEl);
    this.containerEl.appendChild(this.videoEl);
    this.containerEl.appendChild(this.rawCanvasEl);
    this.containerEl.appendChild(this.blendCanvasEl);

    document.body.appendChild(this.containerEl);
  }


  static get VERSION() {
    return '1.0.0';
  }

  static get instanceExists() {
    return false;
  }

  static set instanceExists(bool) {
    Diffy.instanceExists = bool;
  }


  static create(options) {
    if(Diffy.instanceExists) {
      throw new Error(`It seems a diffy instance
      already exists on this page.`);
    }

    return new this(options);
    Diffy.instanceExists = true;
  }
}

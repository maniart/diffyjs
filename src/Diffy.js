export default class Diffy {
  constructor({
    tickFn = () => {},
    captureFn = () => {},
    DiffWorker = () => {},
    roundFn = () => {},
    win = {},
    doc = {},
    debug = false,
    sourceDimensions = { w: 130, h: 100 },
    onFrame = () => {},
    sensitivity = 0.2,
    threshold = 21,
    containerClassName = 'diffy--debug-view',
    resolution = { x: 10, y: 5 }
  }) {

    const _win = win;
    this.doc = doc;

    const baseCaptureConfig = {
      audio: false,
      video: {
        width: 130,
        height: 100
      }
    };

    this.captureConfig = Object.assign({}, baseCaptureConfig, {
      video: { width: sourceDimensions.w, height: sourceDimensions.h}
    });

    this.tickFn = tickFn.bind(_win);
    this.captureFn = captureFn;
    this.roundFn = roundFn;

    this.onFrame = onFrame;

    this.currentImageData = null;
    this.previousImageData = null;

    this.resolutionX = resolution.x;
    this.resolutionY = resolution.y;

    this.sensitivity = sensitivity;
    this.threshold = threshold;

    this.debug = debug;
    this.containerClassName = containerClassName;
    this.debugViewCollapsed = false;

    this.sourceWidth = sourceDimensions.w;
    this.sourceHeight = sourceDimensions.h;

    this.worker = new DiffWorker;

    this.initialized = false;

    this.VERSION = '1.3.2';

    _win.addEventListener('load', this.init.bind(this));
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
    const data1 = frame1.data;
    const data2 = frame2.data;
    const length = data1.length;
    const buffer = new ArrayBuffer(length);

    this.worker.postMessage({
      buffer,
      data1,
      data2,
      sensitivity: this.sensitivity,
      threshold: this.threshold,
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

  createMatrix() {
    let i;
    let j;
    let k = 0;

    const matrix = [];
    const sourceWidth = this.sourceWidth;
    const sourceHeight = this.sourceHeight;
    const cellWidth = this.sourceWidth / this.resolutionX;
    const cellHeight = this.sourceHeight / this.resolutionY;


    let cellImageData = null;
    let cellImageDataLength;
    let cellPixelCount;
    let average = 0;

    for(i = 0; i < sourceWidth; i += cellWidth) {
      const row = [];

      for(j = 0; j < sourceHeight; j += cellHeight) {
        cellImageData = this.blendCanvasCtx.getImageData(i, j, cellWidth, cellHeight).data;

        /* TODO refactor with bitshifting */
        cellImageDataLength = cellImageData.length;
        cellPixelCount = cellImageDataLength / 4;
        while(k < cellPixelCount) {
          average += (cellImageData[k * 4] + cellImageData[k * 4 + 1] + cellImageData[k * 4 + 2]) / 3;
          ++ k;
        }
        average = this.roundFn(average / cellPixelCount);
        /* push the value in the row */
        row.push(average);
        average = 0;
        k = 0;
      }
      matrix.push(row); // store the row in matrix
    }

    return matrix;
  }

  loop() {
    this.toCanvas(this.videoEl, this.rawCanvasEl);
    this.blend(this.rawCanvasEl);
    this.onFrame(this.createMatrix());
    this.tickFn(this.loop.bind(this));
  }

  init() {
    this.worker.addEventListener('error', (e) => {
      throw e;
    });
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
    this.containerEl = this.doc.createElement('div');
    this.containerEl.className = containerClassName;

    this.videoEl = this.doc.createElement('video');
    this.videoEl.className = 'video view';
    this.videoEl.setAttribute('autoplay', '');
    this.videoEl.width = this.sourceWidth;
    this.videoEl.height = this.sourceHeight;

    this.rawCanvasEl = this.doc.createElement('canvas');
    this.rawCanvasEl.className = 'canvas--raw view';
    this.rawCanvasEl.width = this.sourceWidth;
    this.rawCanvasEl.height = this.sourceHeight;

    this.blendCanvasEl = this.doc.createElement('canvas');
    this.blendCanvasEl.className = 'canvas--blend view';
    this.blendCanvasEl.width = this.sourceWidth;
    this.blendCanvasEl.height = this.sourceHeight;

    this.headerEl = this.doc.createElement('header');
    this.headerEl.className = 'header';

    this.titleEl = this.doc.createElement('h1');
    this.titleEl.className = 'title';
    this.titleEl.innerText = 'Diffy debug view';

    this.toggleEl = this.doc.createElement('span');
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

    this.doc.body.appendChild(this.containerEl);

    if (!this.debug) {
      this.containerEl.classList.add('hidden');
    }
  }

  injectCssStyles() {
    const node = this.doc.createElement('style');
    const containerClassName = this.containerClassName;
    const styles = `
      .${containerClassName} {
        position: fixed;
        top: 0;
        left: 0;
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
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
        font-weight: 300;
        letter-spacing: 2px;
        font-size: 16px;
      }
      .${containerClassName} .toggle { padding: 5px; }
      .${containerClassName} .view { padding: 5px; }
      .${containerClassName} .view.hidden, .${containerClassName}.hidden { display: none; }
    `;
    node.innerHTML = styles;
    this.doc.body.appendChild(node);
  }

  initDom(containerClassName) {
    this.createElements(containerClassName);
    this.injectCssStyles();
  }

  static create(options) {
    return new this(options);
  }
}

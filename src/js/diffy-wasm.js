import init, { DiffyWasm } from '../../pkg/diffyjs_wasm.js';

let wasmInitialized = false;

class DiffyWrapper {
  constructor({
    tickFn = () => {},
    captureFn = () => {},
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
    this.tickFn = tickFn.bind(win);
    this.captureFn = captureFn;
    this.roundFn = roundFn;
    this.win = win;
    this.doc = doc;
    this.onFrame = onFrame;
    this.debug = debug;
    this.containerClassName = containerClassName;
    this.debugViewCollapsed = false;
    this.initialized = false;

    this.sourceWidth = sourceDimensions.w;
    this.sourceHeight = sourceDimensions.h;
    this.resolutionX = resolution.x;
    this.resolutionY = resolution.y;
    this.sensitivity = sensitivity;
    this.threshold = threshold;

    this.VERSION = '2.0.0';

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

    this.currentImageData = null;
    this.previousImageData = null;

    // Initialize WASM and set up event listeners
    this.initWasm().then(() => {
      this.win.addEventListener('load', this.init.bind(this));
    });
  }

  async initWasm() {
    if (!wasmInitialized) {
      await init();
      wasmInitialized = true;
    }
    
    this.wasmDetector = new DiffyWasm(
      this.sourceWidth,
      this.sourceHeight,
      this.resolutionX,
      this.resolutionY,
      this.sensitivity,
      this.threshold
    );
  }

  toCanvas(video, canvas) {
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

  blend(canvas) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    this.currentImageData = ctx.getImageData(0, 0, width, height);
    
    if (this.wasmDetector) {
      const matrix = this.wasmDetector.process_frame(this.currentImageData.data);
      
      // Get diff buffer from WASM and update blend canvas
      const diffBuffer = this.wasmDetector.get_diff_buffer();
      this.blendImageData.data.set(diffBuffer);
      this.blendCanvasCtx.putImageData(this.blendImageData, 0, 0);
      
      return this.convertFlatMatrixTo2D(matrix);
    }
    
    return [];
  }

  convertFlatMatrixTo2D(flatMatrix) {
    const matrix = [];
    for (let i = 0; i < this.resolutionX; i++) {
      const row = [];
      for (let j = 0; j < this.resolutionY; j++) {
        const index = i * this.resolutionY + j;
        row.push(flatMatrix[index] || 0);
      }
      matrix.push(row);
    }
    return matrix;
  }

  loop() {
    this.toCanvas(this.videoEl, this.rawCanvasEl);
    const matrix = this.blend(this.rawCanvasEl);
    this.onFrame(matrix);
    this.tickFn(this.loop.bind(this));
  }

  init() {
    this.initDom(this.containerClassName);
    this.blendCanvasCtx = this.blendCanvasEl.getContext('2d');
    this.blendImageData = this.blendCanvasCtx.getImageData(0, 0, this.sourceWidth, this.sourceHeight);

    this.captureFn(this.captureConfig).then((stream) => {
      [this.rawCanvasEl, this.blendCanvasEl].forEach(this.mirror);
      this.videoEl.srcObject = stream;
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
    this.titleEl.innerText = 'Diffy debug view (WASM)';

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

export default DiffyWrapper;
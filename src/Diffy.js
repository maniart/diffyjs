export default class Diffy {
  constructor({
    tickFn,
    captureFn,
    debug = false,
    containerClassname = 'diffy--debug-view',
    resolution: { x, y }
  }) {

    this.tickFn = tickFn;
    this.captureFn = captureFn;

    this.currentImageData = null;
    this.previousImageData = null;

    this.resolutionX = x;
    this.resolutionY = y;

    this.debug = debug;
    this.containerClassname = containerClassname;

    this.constraints = {
      audio: false,
      video: {
        width: 260,
        height: 200
      }
    };

    console.log('tickFn: ', this.tickFn);
    console.log('captureFn: ', this.captureFn);
    console.log('debug: ', this.debug);
    console.log('className: ', this.containerClassname);
    console.log('resolution: ', this.resolutionX, this.resolutionY);

  }

  toVideo() {

  }

  toCanvas() {

  }



  tick() {
    requestAnimFrame(this.tick);
  }

  init() {
    function doInit() {
      console.log('DOM ready. Init...');
    }

    window.addEventListener('load', doInit);
  }

  createElements() {
    const container = document.createElement('div');
    container.className = className;

    const video = document.createElement('video');
    video.className = 'debug--video';

    const rawCanvas = document.createElement('canvas');
    rawCanvas.className = 'debug--raw-canvas';

    const blendCanvas = document.createElement('div');
    blendCanvas.className = 'debug--blend-canvas';

    const header = document.createElement('div');
    header.className = 'debug--header';

    const title = document.createElement('h6');
    title.className = 'debug--title';
    title.innerText = 'diffy debug view';

    const toggle = document.createElement('span');
    toggle.innerText = '-';
    header.appendChild(toggle);
    header.appendChild(title);

    container.appendChild(header);
    container.appendChild(video);
    container.appendChild(rawCanvas);
    container.appendChild(blendCanvas);
  }

  createDebugView() {
    const container = document.createElement('div');
    container.className = className;

    const video = document.createElement('video');
    video.className = 'debug--video';

    const rawCanvas = document.createElement('canvas');
    rawCanvas.className = 'debug--raw-canvas';

    const blendCanvas = document.createElement('div');
    blendCanvas.className = 'debug--blend-canvas';

    const header = document.createElement('div');
    header.className = 'debug--header';

    const title = document.createElement('h6');
    title.className = 'debug--title';
    title.innerText = 'diffy debug view';

    const toggle = document.createElement('span');
    toggle.innerText = '-';
    header.appendChild(toggle);
    header.appendChild(title);

    container.appendChild(header);
    container.appendChild(video);
    container.appendChild(rawCanvas);
    container.appendChild(blendCanvas);

    document.body.appendChild(container);
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

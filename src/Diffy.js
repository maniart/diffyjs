export default class Diffy {
  constructor({
    tickFn = () => {},
    captureFn = () => {},
    debug = false,
    onTick = (values) => {},
    onMotion = (values) => {},
    sensitivity = 0.5,
    containerClassName = 'diffy--debug-view',
    resolution = { x: 10, y: 5 }
  }) {

    this.tickFn = tickFn;
    this.captureFn = captureFn;

    this.currentImageData = null;
    this.previousImageData = null;

    this.resolutionX = resolution.x;
    this.resolutionY = resolution.y;

    this.sensitivity = sensitivity;

    this.debug = debug;
    this.containerClassName = containerClassName;

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
    console.log('className: ', this.containerClassName);
    console.log('resolution: ', this.resolutionX, this.resolutionY);

    window.addEventListener('load', this.init.bind(this))

  }

  toVideo() {

  }

  toCanvas() {

  }



  tick() {
    requestAnimFrame(this.tick);
  }

  init() {
    console.log('DOM ready. Init...');
    this.createElements(this.containerClassName);
  }

  createElements(containerClassName) {
    const container = document.createElement('div');
    container.className = containerClassName;

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

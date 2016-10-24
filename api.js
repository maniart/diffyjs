import diffy from 'diffyjs';


const stream = diffy.createStream({
  resolution: {x: 10, y: 5},
  threshold: 0.4,
  debug: true
}).on('data', matrix => {

}).on('end', () => {

}).on('error', err => {
  console.error(err)
});

// this should implement a ReadableStream interface
// which means it should be an instance of EventEmitter
stream.pause();
console.log(stream.isPaused()) // true;
stream.resume();
console.log(streams.is)


diffy.started // false

const diffy = diffy.init(config);

diffy.initialized // true
diffy.paused // false
diffy.started // true

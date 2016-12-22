/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
/*
  shim getUserMedia with a Promise api
  source: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
*/
const getUserMedia = (constraints, successCallback, errorCallback) => {

  // First get a hold of getUserMedia, if present
  const getUserMedia = (navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia);

  // Some browsers just don't implement it - return a rejected promise with an error
  // to keep a consistent interface
  if(!getUserMedia) {
    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
  }

  // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
  return new Promise((successCallback, errorCallback) => {
    getUserMedia.call(navigator, constraints, successCallback, errorCallback);
  });

}

// Older browsers might not implement mediaDevices at all, so we set an empty object first
if(navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}

// Some browsers partially implement mediaDevices. We can't just assign an object
// with getUserMedia as it would overwrite existing properties.
// Here, we will just add the getUserMedia property if it's missing.
if(navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = getUserMedia;
}

/*
  capture from camera
  returns objectUrl
 */
const capture = (constraints) => {
  return navigator.mediaDevices.getUserMedia(constraints)
    .then((stream) => window.URL.createObjectURL(stream))
    .catch(({ name, message }) => console.error(`${name} : ${message}`));
}

export default capture;

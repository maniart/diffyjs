/* eslint-disable no-console */

/*
  utility function to log only once
  useful for logging in loops
*/
export const createOnceLog = () => {
  let counter = 0;
  return function onceLog() {
    if(counter < 1) {
      console.log(...arguments);
    }
    counter ++;
  }
}

/*
  utility function to access DOM references
*/
export const $ = (selector) => document.querySelector(selector);

/*
  bitwise Math.round
*/
export const round = (number) => (number + .5) >> 0;

/*
  butwise Math.abs
*/
export const abs = (value) => (value ^ (value >> 31)) - (value >> 31);


/*
  polarize pixel values based on value and threshold
*/
export const polarize = (value, threshold) => (value > threshold) ? 0x00 : 0XFF;

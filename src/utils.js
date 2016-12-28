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
  utility function for getting DOM references
  return DOM Object
*/
export const $ = (selector) => document.querySelector(selector);

/*
  bitwise Math.round
  returns number
*/
export const round = (number) => (number + .5) >> 0;


export const abs = (value) => (value ^ (value >> 31)) - (value >> 31);


/*
  polarize pixel values based on value and threshold
  returns 0 or 0XFF
*/
export const polarize = (value, threshold) => (value > threshold) ? 0xFF0033 : 0XFF;

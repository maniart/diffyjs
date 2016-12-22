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

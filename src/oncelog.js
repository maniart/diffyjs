/* eslint-disable no-console */

/*
  utility function to log only once
  useful for logging in loops
*/
const createOnceLog = () => {
  let counter = 0;
  return function onceLog() {
    if(counter < 1) {
      console.log(...arguments);
    }
    counter ++;
  }
}

export default createOnceLog;

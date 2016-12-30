import { expect } from 'chai';
import { window } from './mocks';
import Diffy from '../src/Diffy';

describe('Diffy', () => {
  let diffy;

  describe('#constructor', () => {
    it('requires a config object', () => {
      expect (() => {
        new Diffy();
      }).to.throw(Error);
    });
  });

  describe('#resolutionX', () => {
    it('should be set correctly', () => {
      diffy = new Diffy({
        resolution: {x: 10, y: 5},
        win: window
      });
      expect(diffy.resolutionX).to.equal(10);
    });
  });

  describe('#resolutionY', () => {
    it('should be set correctly', () => {
      diffy = new Diffy({
        resolution: {x: 10, y: 5},
        win: window
      });
      expect(diffy.resolutionY).to.equal(5);
    });
  });

  describe('#tickFn', () => {
    it('should be a function', () => {
      diffy = new Diffy({
        resolution: {x: 10, y: 5},
        tickFn: () => {},
        win: window
      });
      expect(typeof diffy.tickFn).to.equal('function');
    });
  });

  describe('#captureFn', () => {
    it('should be a function', () => {
      diffy = new Diffy({
        resolution: {x: 10, y: 5},
        captureFn: () => {},
        win: window
      });
      expect(typeof diffy.captureFn).to.equal('function');
    });
  });

  describe('#roundFn', () => {
    it('should be a function', () => {
      diffy = new Diffy({
        resolution: {x: 10, y: 5},
        roundFn: () => {},
        win: window
      });
      expect(typeof diffy.roundFn).to.equal('function');
    });
  });

  describe('#onFrame', () => {
    diffy = new Diffy({
      resolution: {x: 10, y: 5},
      onFrame: (matrix) => { console.log(matrix); },
      win: window
    });
    it('should be a function', () => {
      expect(typeof diffy.onFrame).to.equal('function');
    });
  });

  describe('#sensitivity', () => {
    diffy = new Diffy({
      resolution: {x: 10, y: 5},
      sensitivity: 0.5,
      onFrame: (matrix) => { console.log(matrix); },
      win: window
    });
    it('should be a number', () => {
      expect(typeof diffy.sensitivity).to.equal('number');
    });
  });

});

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

  describe('#reslutionX', () => {
    it('should be set correctly', () => {
      diffy = new Diffy({ resolution: {x: 10, y: 5}});
      expect(diffy.resolutionX).to.equal(10);
    });
  });

});

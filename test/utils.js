import { expect } from 'chai';
import { round } from '../src/utils';

describe('utils', () => {

  describe('bitwise Math.round', () => {

    it('rounds 5.5 to 6', () => {
      expect(round(5.5)).to.equal(6);
    });

    it('rounds 173.2 to 173', () => {
      expect(round(173.2)).to.equal(173);
    });

    it('rounds 9238422.8734282342 to 9238423', () => {
      expect(round(9238422.8734282342)).to.equal(9238423);
    });

  });

});

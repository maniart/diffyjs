import { expect } from 'chai';
import { round, abs, polarize } from '../src/utils';

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

    it('rounds 0 to 0', () => {
      expect(round(0)).to.equal(0);
    });

    it('rounds -0 to 0', () => {
      expect(round(-0)).to.equal(0);
    });

    it('rounds undefined to 0', () => {
      expect(round(undefined)).to.equal(0);
    });

    it('rounds null to 0', () => {
      expect(round(null)).to.equal(0);
    });

  });

  describe('bitwise Math.abs', () => {

    it('equals 82736 from 82736.091283913401034', () => {
      expect(abs(82736.091283913401034)).to.equal(82736);
    });

    it('equals 82736 from -82736.091283913401034', () => {
      expect(abs(-82736.091283913401034)).to.equal(82736);
    });

    it('equals 0 from 0', () => {
      expect(abs(0)).to.equal(0);
    });

    it('equals 0 from -0', () => {
      expect(abs(-0)).to.equal(0);
    });

    it('equals 0 from undefined', () => {
      expect(round(undefined)).to.equal(0);
    });

    it('equals 0 from null', () => {
      expect(round(null)).to.equal(0);
    });

  });

  describe('polarize pixels', () => {

    it('5 to equal 255 at threshold 10', () => {
      expect(polarize(5, 10));
    })

    it('5 to equal 0 at threshold 1', () => {
      expect(polarize(5, 1));
    })

    it('0 to equal 0 at threshold 10', () => {
      expect(polarize(0, 10));
    })

    it('null to equal 255 at threshold 10', () => {
      expect(polarize(null, 10));
    })

    it('undefined to equal 0 at threshold -0', () => {
      expect(polarize(undefined, -0));
    })

  });

});

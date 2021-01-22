import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import { Chance } from 'chance';
import { vendorEntity } from '../../src/entities/vendor';
import { VendorType } from '../../src/types';

const chance = new Chance();

chai.use(chaiAsPromised);

import { MissingVendorInformationError } from '../../src/custom-errors';

describe('Vendor Entity', () => {
  describe('Given expected input', () => {
    it('should return the expected output', async () => {
      const mock = {
        name: chance.name({ middle: true }),
        type: VendorType.Seamless,
      };

      await expect(vendorEntity(mock)).to.eventually.fulfilled.and.have.keys(
        'name',
        'type',
      );
    });
  });

  describe('Given no name', () => {
    it('should throw an error', async () => {
      const mock = {
        name: '',
        type: VendorType.Seamless,
      };

      await expect(vendorEntity(mock))
        .to.eventually.rejectedWith('Please input name')
        .and.be.an.instanceOf(MissingVendorInformationError);
    });
  });

  describe('Given no type', () => {
    it('should throw an error', async () => {
      const mock = {
        name: chance.name({ middle: true }),
        type: '',
      };

      await expect(vendorEntity(mock))
        .to.eventually.rejectedWith('Please input type')
        .and.be.an.instanceOf(MissingVendorInformationError);
    });
  });
});

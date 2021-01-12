import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import mongoose from 'mongoose';

import { Chance } from 'chance';
import {
  insertVendorUseCase,
  selectAllVendorsUseCase,
  selectOneVendorUseCase,
  updateVendorUseCase,
  deleteOneVendorUseCase,
} from '../../../src/use-cases/vendors';

import { Vendor } from '../../../src/lib/mongoose/models/vendor';

import { VendorType } from '../../../src/types';

import { initializeDatabase } from '../../../src/lib/mongoose';

chai.use(chaiAsPromised);

const chance = new Chance();

describe('Vendor Use Cases', () => {
  before(async function () {
    this.mockedId = mongoose.Types.ObjectId().toString();
    this.mock = null;
    this.randomName = () => chance.name({ middle: true });
    await initializeDatabase();
  });

  describe('Adding a Vendor', () => {
    afterEach(() => {
      return Vendor.deleteMany({});
    });

    beforeEach(() => {
      return Vendor.deleteMany({});
    });

    describe('GIVEN correct inputs', () => {
      it('should return the added vendor details', async function () {
        this.mock = {
          id: null,
          info: {
            name: this.randomName(),
            type: VendorType.Seamless,
          },
          source: null,
        };

        await expect(insertVendorUseCase(this.mock)).to.eventually.fulfilled.and
          .be.true;
      });
    });

    describe('GIVEN no name', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: null,
          info: {
            name: null,
            type: VendorType.Seamless,
          },
          source: null,
        };

        await expect(insertVendorUseCase(this.mock)).to.eventually.rejectedWith(
          'Please input name',
        );
      });
    });

    describe('GIVEN no type', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: null,
          info: {
            name: this.randomName(),
            type: null,
          },
          source: null,
        };

        await expect(insertVendorUseCase(this.mock)).to.eventually.rejectedWith(
          'Please input type',
        );
      });
    });

    describe('GIVEN invalid type', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: null,
          info: {
            name: this.randomName(),
            type: 'qwe',
          },
          source: null,
        };

        await expect(insertVendorUseCase(this.mock)).to.eventually.rejected;
      });
    });

    describe('GIVEN existing vendor name', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: null,
          info: {
            name: this.randomName(),
            type: VendorType.Seamless,
          },
          source: null,
        };

        await expect(insertVendorUseCase(this.mock)).to.eventually.fulfilled.and
          .be.true;

        await expect(insertVendorUseCase(this.mock)).to.eventually.rejectedWith(
          'Vendor already exists',
        );
      });
    });
  });

  describe('Selecting All Vendors', () => {
    after(() => {
      return Vendor.deleteMany({});
    });

    before(async function () {
      await Vendor.deleteMany({});
      this.mock = {
        name: this.randomName(),
        type: VendorType.Seamless,
      };
      await Vendor.create(this.mock);
    });

    it('should return list of vendors', async function () {
      await expect(
        selectAllVendorsUseCase({ id: null, info: null, source: null }),
      ).to.eventually.fulfilled.and.length(1);
    });
  });

  describe('Selecting One Vendor', () => {
    after(() => {
      return Vendor.deleteMany({});
    });

    before(async function () {
      await Vendor.deleteMany({});
      this.mock = await Vendor.create({
        name: this.randomName(),
        type: VendorType.Seamless,
      });
    });

    describe('GIVEN valid ID', () => {
      it('should return the vendor corresponding with the GIVEN ID', async function () {
        await expect(
          selectOneVendorUseCase({
            id: this.mock._id,
            info: null,
            source: null,
          }),
        ).to.eventually.fulfilled.property('_id', this.mock._id);
      });
    });

    describe('GIVEN valid but not existent ID', () => {
      it('should throw an error', async function () {
        await expect(
          selectOneVendorUseCase({
            id: this.mockedId,
            info: null,
            source: null,
          }),
        ).to.eventually.rejectedWith("Vendor doesn't exist");
      });
    });
  });

  describe('Updating One Vendor', () => {
    after(() => {
      return Vendor.deleteMany({});
    });

    before(async function () {
      await Vendor.deleteMany({});
      this.mock = await Vendor.create({
        name: this.randomName(),
        type: VendorType.Seamless,
      });
    });

    describe('GIVEN valid id and TRANSFER type', () => {
      it('should successfully update to a transfer vendor', async function () {
        await expect(
          updateVendorUseCase({
            id: this.mock._id,
            info: { name: this.randomName(), type: VendorType.Transfer },
            source: null,
          }),
        ).to.eventually.fulfilled.and.be.true;
      });
    });

    describe('GIVEN valid id and SEAMLESS type', () => {
      it('should successfully update to a seamless vendor', async function () {
        await expect(
          updateVendorUseCase({
            id: this.mock._id,
            info: { name: this.randomName(), type: VendorType.Seamless },
            source: null,
          }),
        ).to.eventually.fulfilled.and.be.true;
      });
    });

    describe('Given an non existent ID', () => {
      it('should throw an error', async function () {
        await expect(
          updateVendorUseCase({
            id: this.mockedId,
            info: { name: this.randomName(), type: VendorType.Seamless },
            source: null,
          }),
        ).to.eventually.rejectedWith("Vendor ID doesn't exist");
      });
    });

    describe('GIVEN no name', () => {
      it('should throw an error', async function () {
        await expect(
          updateVendorUseCase({
            id: this.mock._id,
            info: { name: null, type: VendorType.Seamless },
            source: null,
          }),
        ).to.eventually.rejectedWith('Please input name');
      });
    });

    describe('GIVEN no type', () => {
      it('should throw an error', async function () {
        await expect(
          updateVendorUseCase({
            id: this.mock._id,
            info: { name: 'Luis Angelo Belmonte', type: null },
            source: null,
          }),
        ).to.eventually.rejectedWith('Please input type');
      });
    });

    describe('GIVEN an invalid type', () => {
      it('should throw an error', async function () {
        await expect(
          updateVendorUseCase({
            id: this.mock._id,
            info: { name: 'Luis Angelo Belmonte', type: 'qwe' },
            source: null,
          }),
        ).to.eventually.rejected;
      });
    });
  });

  describe('Deleting One Vendor', () => {
    after(() => {
      return Vendor.deleteMany({});
    });

    before(async function () {
      await Vendor.deleteMany({});
      this.mock = await Vendor.create({
        name: this.randomName(),
        type: VendorType.Seamless,
      });
    });
    describe('GIVEN a valid ID', () => {
      it('should throw an error', async function () {
        await expect(
          deleteOneVendorUseCase({
            id: this.mock._id,
            source: null,
            info: null,
          }),
        ).to.eventually.fulfilled.and.be.true;
      });
    });

    describe('GIVEN a non existent ID', () => {
      it('should throw an error', async function () {
        await expect(
          deleteOneVendorUseCase({
            id: this.mockedId,
            source: null,
            info: null,
          }),
        ).to.eventually.rejectedWith("Vendor doesn't exist");
      });
    });
  });
});

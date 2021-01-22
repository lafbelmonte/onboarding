import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import mongoose from 'mongoose';

import { Chance } from 'chance';
import { Vendor } from '../../../src/lib/mongoose/models/vendor';

import { vendorsStore } from '../../../src/data-access/mongoose/vendors';

import { initializeDatabase, closeDatabase } from '../../../src/lib/mongoose';

import { VendorType } from '../../../src/types';

chai.use(chaiAsPromised);

const chance = new Chance();

const {
  insertOneVendor,
  vendorExistsByFilter,
  selectAllVendors,
  selectOneVendorByFilters,
  updateVendorByFilters,
  deleteOneVendor,
} = vendorsStore;

describe('Vendor Store', () => {
  before(async function () {
    this.mock = null;
    this.randomName = () => chance.name({ middle: true });
    this.mockedId = mongoose.Types.ObjectId().toString();
    await initializeDatabase();
  });

  after(async function () {
    await closeDatabase();
  });

  describe('Insert one Vendor', () => {
    afterEach(() => {
      return Vendor.deleteMany({});
    });

    beforeEach(() => {
      return Vendor.deleteMany({});
    });

    describe('GIVEN correct inputs and SEAMLESS type', () => {
      it('should successfully add vendor to the database', async function () {
        this.mock = {
          name: this.randomName(),
          type: VendorType.Seamless,
        };
        await expect(insertOneVendor(this.mock)).to.eventually.fulfilled;
      });
    });

    describe('GIVEN correct inputs and TRANSFER type', () => {
      it('should successfully add vendor to the database', async function () {
        this.mock = {
          name: this.randomName(),
          type: VendorType.Transfer,
        };
        await expect(insertOneVendor(this.mock)).to.eventually.fulfilled;
      });
    });

    describe('GIVEN no name', () => {
      it('should throw an error', async function () {
        this.mock = {
          name: '',
          type: VendorType.Seamless,
        };
        await expect(insertOneVendor(this.mock)).to.eventually.rejected;
      });
    });

    describe('GIVEN no type', () => {
      it('should throw an error', async function () {
        this.mock = {
          name: this.randomName(),
          type: '',
        };
        await expect(insertOneVendor(this.mock)).to.eventually.rejected;
      });
    });

    describe('GIVEN invalid type', () => {
      it('should throw an error', async function () {
        this.mock = {
          name: this.randomName(),
          type: this.randomName(),
        };
        await expect(insertOneVendor(this.mock)).to.eventually.rejected;
      });
    });
  });

  describe('Vendor exists? By filters', () => {
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
    describe('GIVEN existent filters', () => {
      it('should return true', async function () {
        await expect(vendorExistsByFilter({ _id: this.mock._id })).to.eventually
          .fulfilled.be.true;
      });
    });

    describe('GIVEN non existent filters', () => {
      it('should return false', async function () {
        await expect(vendorExistsByFilter({ _id: this.mockedId })).to.eventually
          .fulfilled.be.false;
      });
    });
  });

  describe('Select All Vendors', () => {
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

    it('should return a list of vendors', async () => {
      await expect(selectAllVendors()).eventually.fulfilled.and.have.length(1);
    });
  });

  describe('Select One Vendor By Filters', () => {
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

    describe('GIVEN existent filters', () => {
      it('should return the vendor', async function () {
        await expect(
          selectOneVendorByFilters({ _id: this.mock._id }),
        ).to.eventually.fulfilled.property('_id', this.mock._id);
      });
    });

    describe('GIVEN non existent filters', () => {
      it('should return the vendor', async function () {
        await expect(selectOneVendorByFilters({ _id: this.mockedId })).to
          .eventually.fulfilled.and.null;
      });
    });
  });

  describe('Updating a vendor', () => {
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

    describe('GIVEN correct inputs and SEAMLESS type', () => {
      it('should update the vendor to SEAMLESS', async function () {
        await expect(
          updateVendorByFilters(
            { _id: this.mock._id },
            {
              name: this.randomName(),
              type: VendorType.Seamless,
            },
          ),
        ).to.eventually.fulfilled.property('type', 'SEAMLESS');
      });
    });

    describe('GIVEN correct inputs and TRANSFER type', () => {
      it('should update the vendor to TRANSFER', async function () {
        await expect(
          updateVendorByFilters(
            { _id: this.mock._id },
            {
              name: this.randomName(),
              type: VendorType.Transfer,
            },
          ),
        ).to.eventually.fulfilled.property('type', 'TRANSFER');
      });
    });

    describe('GIVEN invalid type', () => {
      it('should throw an error', async function () {
        await expect(
          updateVendorByFilters(
            { _id: this.mock._id },
            {
              name: this.randomName(),
              type: this.randomName(),
            },
          ),
        ).to.eventually.rejected;
      });
    });

    describe('GIVEN non existent ID', () => {
      it('should return null', async function () {
        await expect(
          updateVendorByFilters(
            { _id: this.mockedId },
            {
              name: this.randomName(),
              type: VendorType.Transfer,
            },
          ),
        ).to.eventually.fulfilled.and.be.null;
      });
    });
  });

  describe('Deleting a Vendor', () => {
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

    describe('GIVEN valid and existent vendor ID', () => {
      it('should return true', async function () {
        await expect(deleteOneVendor({ _id: this.mock._id })).to.eventually
          .fulfilled.and.be.true;
      });
    });

    describe('GIVEN non existent vendor ID', () => {
      it('should return true', async function () {
        await expect(deleteOneVendor({ _id: this.mockedId })).to.eventually
          .fulfilled.and.be.false;
      });
    });
  });
});

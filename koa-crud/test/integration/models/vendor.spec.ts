import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import mongoose from 'mongoose';

import { Chance } from 'chance';
import { initializeDatabase, closeDatabase } from '@lib/mongoose';

import VendorModel, { VendorType } from '@lib/mongoose/models/vendor';

chai.use(chaiAsPromised);

const chance = new Chance();

describe('Vendor Models', () => {
  before(async function () {
    this.randomName = () => chance.name({ middle: true });
    this.mock = null;
    this.mockedId = mongoose.Types.ObjectId().toString();
    await initializeDatabase();
  });

  after(async function () {
    await closeDatabase();
  });

  describe('Creating a vendor', () => {
    afterEach(() => {
      return VendorModel.deleteMany({});
    });

    beforeEach(() => {
      return VendorModel.deleteMany({});
    });

    describe('GIVEN correct inputs and SEAMLESS type', () => {
      it('should be fulfilled', async function () {
        const data = {
          name: this.randomName(),
          type: VendorType.Seamless,
        };
        await expect(VendorModel.create(data)).to.eventually.fulfilled;
      });
    });

    describe('GIVEN correct inputs and TRANSFER type', () => {
      it('should be fulfilled', async function () {
        const data = {
          name: this.randomName(),
          type: VendorType.Transfer,
        };
        await expect(VendorModel.create(data)).to.eventually.fulfilled;
      });
    });

    describe('GIVEN no name', () => {
      it('should be rejected', async () => {
        const data = {
          name: '',
          type: VendorType.Transfer,
        };
        await expect(VendorModel.create(data)).to.eventually.rejected;
      });
    });

    describe('GIVEN no type', () => {
      it('should be rejected', async function () {
        const data = {
          name: this.randomName(),
          type: '',
        };
        await expect(VendorModel.create(data)).to.eventually.rejected;
      });
    });

    describe('GIVEN invalid type', () => {
      it('should be rejected', async function () {
        const data = {
          name: this.randomName(),
          type: 'qwe',
        };
        await expect(VendorModel.create(data)).to.eventually.rejected;
      });
    });
  });

  describe('Updating a vendor by filters', () => {
    after(() => {
      return VendorModel.deleteMany({});
    });

    before(async function () {
      await VendorModel.deleteMany({});
      this.mock = await VendorModel.create({
        name: this.randomName(),
        type: VendorType.Seamless,
      });
    });

    describe('GIVEN correct inputs and SEAMLESS type', () => {
      it('should be fulfilled', async function () {
        const data = {
          name: this.randomName(),
          type: VendorType.Seamless,
        };

        await expect(
          VendorModel.findOneAndUpdate({ _id: this.mock._id }, data, {
            new: true,
            runValidators: true,
          }),
        ).to.eventually.fulfilled;
      });
    });

    describe('GIVEN correct inputs and TRANSFER type', () => {
      it('should be fulfilled', async function () {
        const data = {
          name: this.randomName(),
          type: VendorType.Transfer,
        };

        await expect(
          VendorModel.findOneAndUpdate({ _id: this.mock._id }, data, {
            new: true,
            runValidators: true,
          }),
        ).to.eventually.fulfilled;
      });
    });

    describe('GIVEN invalid type', () => {
      it('should be rejected', async function () {
        const data = {
          name: this.randomName(),
          type: '',
        };
        await expect(
          VendorModel.findOneAndUpdate({ _id: this.mock._id }, data, {
            new: true,
            runValidators: true,
          }),
        ).to.eventually.rejected;
      });
    });

    describe('GIVEN no name', () => {
      it('should be rejected', async function () {
        const data = {
          name: '',
          type: VendorType.Transfer,
        };
        await expect(
          VendorModel.findOneAndUpdate({ _id: this.mock._id }, data, {
            new: true,
            runValidators: true,
          }),
        ).to.eventually.rejected;
      });
    });
  });

  describe('Vendor exists', () => {
    after(() => {
      return VendorModel.deleteMany({});
    });

    before(async function () {
      await VendorModel.deleteMany({});
      this.mock = await VendorModel.create({
        name: this.randomName(),
        type: VendorType.Seamless,
      });
    });

    describe('GIVEN existent vendor ID', () => {
      it('should be fulfilled and return true', async function () {
        await expect(VendorModel.exists({ _id: this.mock._id })).to.eventually
          .fulfilled.be.true;
      });
    });

    describe('GIVEN a non existent vendor ID', () => {
      it('should be fulfilled and return true', async function () {
        await expect(VendorModel.exists({ _id: this.mockedId })).to.eventually
          .fulfilled.be.false;
      });
    });
  });

  describe('Find Vendors', () => {
    it('should be fulfilled', async () => {
      await expect(VendorModel.find().lean()).to.eventually.fulfilled;
    });
  });

  describe('Find One Vendor', () => {
    it('should be fulfilled', async function () {
      await expect(VendorModel.findOne({ _id: this.mockedId })).to.eventually
        .fulfilled;
    });
  });

  describe('Delete One Vendor', () => {
    afterEach(() => {
      return VendorModel.deleteMany({});
    });

    beforeEach(() => {
      return VendorModel.deleteMany({});
    });

    describe('GIVEN existent vendor ID', () => {
      it('should be fulfilled and deleted count should be 1', async function () {
        this.mock = {
          name: this.randomName(),
          type: VendorType.Seamless,
        };
        const main = await expect(VendorModel.create(this.mock)).to.eventually
          .fulfilled;

        await expect(
          VendorModel.deleteOne({ _id: main._id }),
        ).to.eventually.fulfilled.property('deletedCount', 1);
      });
    });

    describe('GIVEN non existent vendor ID', () => {
      it('should be fulfilled and deleted count should be 0', async function () {
        this.mock = {
          name: this.randomName(),
          type: VendorType.Seamless,
        };
        await expect(VendorModel.create(this.mock)).to.eventually.fulfilled;

        await expect(
          VendorModel.deleteOne({ _id: this.mockedId }),
        ).to.eventually.fulfilled.property('deletedCount', 0);
      });
    });
  });
});

import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import mongoose from 'mongoose';

import { Chance } from 'chance';
import VendorModel, { VendorType } from '@lib/mongoose/models/vendor';

import { initializeDatabase, closeDatabase } from '@lib/mongoose';

import {
  selectAllVendorsController,
  selectOneVendorController,
  insertVendorController,
  updateVendorController,
  deleteOneVendorController,
} from '@controllers/vendors';

const chance = new Chance();

chai.use(chaiAsPromised);

describe('Vendor Controller', () => {
  before(async function () {
    this.mockedId = mongoose.Types.ObjectId().toString();
    this.mock = null;
    this.randomName = () => chance.name({ middle: true });
    await initializeDatabase();
  });

  after(async function () {
    await closeDatabase();
  });

  describe('Adding a vendor', () => {
    afterEach(() => {
      return VendorModel.deleteMany({});
    });

    beforeEach(() => {
      return VendorModel.deleteMany({});
    });

    describe('GIVEN correct inputs and SEAMLESS type', () => {
      it('should return a success status code', async function () {
        const main = {
          body: {
            name: this.randomName(),
            type: VendorType.Seamless,
          },
          query: null,
          params: null,
          ip: null,
          method: null,
          path: null,
          headers: {
            'Content-Type': null,
            Referer: null,
            'User-Agent': null,
          },
        };

        await expect(
          insertVendorController(main),
        ).to.eventually.fulfilled.property('statusCode', 201);
      });
    });

    describe('GIVEN correct inputs and TRANSFER type', () => {
      it('should return a success status code', async function () {
        const main = {
          body: {
            name: this.randomName(),
            type: VendorType.Transfer,
          },
          query: null,
          params: null,
          ip: null,
          method: null,
          path: null,
          headers: {
            'Content-Type': null,
            Referer: null,
            'User-Agent': null,
          },
        };

        await expect(
          insertVendorController(main),
        ).to.eventually.fulfilled.property('statusCode', 201);
      });
    });

    describe('GIVEN no name', () => {
      it('should return an error status code', async () => {
        const main = {
          body: {
            name: null,
            type: VendorType.Seamless,
          },
          query: null,
          params: null,
          ip: null,
          method: null,
          path: null,
          headers: {
            'Content-Type': null,
            Referer: null,
            'User-Agent': null,
          },
        };

        await expect(
          insertVendorController(main),
        ).to.eventually.fulfilled.property('statusCode', 400);
      });
    });

    describe('GIVEN no type', () => {
      it('should return an error status code', async function () {
        const main = {
          body: {
            name: this.randomName(),
            type: null,
          },
          query: null,
          params: null,
          ip: null,
          method: null,
          path: null,
          headers: {
            'Content-Type': null,
            Referer: null,
            'User-Agent': null,
          },
        };

        await expect(
          insertVendorController(main),
        ).to.eventually.fulfilled.property('statusCode', 400);
      });
    });

    describe('GIVEN an invalid type', () => {
      it('should return an error status code', async function () {
        const main = {
          body: {
            name: this.randomName(),
            type: 'qwe',
          },
          query: null,
          params: null,
          ip: null,
          method: null,
          path: null,
          headers: {
            'Content-Type': null,
            Referer: null,
            'User-Agent': null,
          },
        };

        await expect(
          insertVendorController(main),
        ).to.eventually.fulfilled.property('statusCode', 400);
      });
    });

    describe('GIVEN an existing vendor name', () => {
      it('should return an error status code', async function () {
        this.mock = {
          body: {
            name: this.randomName(),
            type: VendorType.Seamless,
          },
          query: null,
          params: null,
          ip: null,
          method: null,
          path: null,
          headers: {
            'Content-Type': null,
            Referer: null,
            'User-Agent': null,
          },
        };

        await expect(
          insertVendorController(this.mock),
        ).to.eventually.fulfilled.property('statusCode', 201);

        await expect(
          insertVendorController(this.mock),
        ).to.eventually.fulfilled.property('statusCode', 400);
      });
    });
  });

  describe('Selecting all vendors', () => {
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

    it('should return a success status code', async () => {
      const main = {
        body: null,
        query: null,
        params: null,
        ip: null,
        method: null,
        path: null,
        headers: {
          'Content-Type': null,
          Referer: null,
          'User-Agent': null,
        },
      };

      await expect(
        selectAllVendorsController(main),
      ).to.eventually.fulfilled.property('statusCode', 200);
    });
  });

  describe('Selecting One Vendor', () => {
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
      it('should return a successfull status code', async function () {
        const main = {
          body: null,
          query: null,
          params: {
            id: this.mock._id,
          },
          ip: null,
          method: null,
          path: null,
          headers: {
            'Content-Type': null,
            Referer: null,
            'User-Agent': null,
          },
        };

        await expect(
          selectOneVendorController(main),
        ).to.eventually.fulfilled.property('statusCode', 200);
      });
    });

    describe('GIVEN non existent vendor ID', () => {
      it('should return an error status code', async function () {
        const main = {
          body: null,
          query: null,
          params: {
            id: this.mockedId,
          },
          ip: null,
          method: null,
          path: null,
          headers: {
            'Content-Type': null,
            Referer: null,
            'User-Agent': null,
          },
        };

        await expect(
          selectOneVendorController(main),
        ).to.eventually.fulfilled.property('statusCode', 400);
      });
    });
  });

  describe('Updating a vendor', () => {
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
      it('should return a successfull status code', async function () {
        const main = {
          body: {
            name: this.randomName(),
            type: VendorType.Seamless,
          },
          query: null,
          params: {
            id: this.mock._id,
          },
          ip: null,
          method: null,
          path: null,
          headers: {
            'Content-Type': null,
            Referer: null,
            'User-Agent': null,
          },
        };

        await expect(
          updateVendorController(main),
        ).to.eventually.fulfilled.property('statusCode', 204);
      });
    });

    describe('GIVEN correct inputs and TRANSFER type', () => {
      it('should return a successfull status code', async function () {
        const main = {
          body: {
            name: this.randomName(),
            type: VendorType.Transfer,
          },
          query: null,
          params: {
            id: this.mock._id,
          },
          ip: null,
          method: null,
          path: null,
          headers: {
            'Content-Type': null,
            Referer: null,
            'User-Agent': null,
          },
        };

        await expect(
          updateVendorController(main),
        ).to.eventually.fulfilled.property('statusCode', 204);
      });
    });

    describe('GIVEN no name', () => {
      it('should return an error status code', async function () {
        const main = {
          body: {
            name: null,
            type: VendorType.Transfer,
          },
          query: null,
          params: {
            id: this.mock._id,
          },
          ip: null,
          method: null,
          path: null,
          headers: {
            'Content-Type': null,
            Referer: null,
            'User-Agent': null,
          },
        };

        await expect(
          updateVendorController(main),
        ).to.eventually.fulfilled.property('statusCode', 400);
      });
    });

    describe('GIVEN no type', () => {
      it('should return an error status code', async function () {
        const main = {
          body: {
            name: this.randomName(),
            type: null,
          },
          query: null,
          params: {
            id: this.mock._id,
          },
          ip: null,
          method: null,
          path: null,
          headers: {
            'Content-Type': null,
            Referer: null,
            'User-Agent': null,
          },
        };

        await expect(
          updateVendorController(main),
        ).to.eventually.fulfilled.property('statusCode', 400);
      });
    });

    describe('GIVEN invalid type', () => {
      it('should return an error status code', async function () {
        const main = {
          body: {
            name: this.randomName(),
            type: 'qwe',
          },
          query: null,
          params: {
            id: this.mock._id,
          },
          ip: null,
          method: null,
          path: null,
          headers: {
            'Content-Type': null,
            Referer: null,
            'User-Agent': null,
          },
        };

        await expect(
          updateVendorController(main),
        ).to.eventually.fulfilled.property('statusCode', 400);
      });
    });
  });

  describe('Deleting a vendor', () => {
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

    describe('GIVEN an existent vendor ID', () => {
      it('should return a successfull status code', async function () {
        const main = {
          body: null,
          query: null,
          params: {
            id: this.mock._id,
          },
          ip: null,
          method: null,
          path: null,
          headers: {
            'Content-Type': null,
            Referer: null,
            'User-Agent': null,
          },
        };

        await expect(
          deleteOneVendorController(main),
        ).to.eventually.fulfilled.property('statusCode', 200);
      });
    });

    describe('GIVEN a non existent vendor ID', () => {
      it('should return a successfull status code', async function () {
        const main = {
          body: null,
          query: null,
          params: {
            id: this.mockedId,
          },
          ip: null,
          method: null,
          path: null,
          headers: {
            'Content-Type': null,
            Referer: null,
            'User-Agent': null,
          },
        };

        await expect(
          deleteOneVendorController(main),
        ).to.eventually.fulfilled.property('statusCode', 400);
      });
    });
  });
});

/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import mongoose from 'mongoose';
import { Chance } from 'chance';
import server from '../../../src/index';

import { Vendor } from '../../../src/lib/mongoose/models/vendor';

import { VendorType } from '../../../src/types';

import {
  closeTestDatabase,
  initializeTestDatabase,
} from '../../../src/lib/mongoose';

chai.use(chaiHttp);

const chance = new Chance();

describe('Vendor Endpoints', function () {
  before(async function () {
    await initializeTestDatabase();
    this.randomName = () => chance.name({ middle: true });
    this.mockedId = mongoose.Types.ObjectId().toString();
    this.mock = null;
    this.request = () => chai.request(server.callback());
  });

  after(async function () {
    await closeTestDatabase();
  });
  describe('POST /vendors', () => {
    afterEach(() => {
      return Vendor.deleteMany({});
    });

    beforeEach(() => {
      return Vendor.deleteMany({});
    });

    describe('GIVEN a SEAMLESS type', function () {
      it('should successfully insert a SEAMLESS type vendor', async function () {
        const main = await this.request().post('/vendors').send({
          name: this.randomName(),
          type: VendorType.Seamless,
        });

        expect(main.status).to.eqls(201);
      });
    });

    describe('GIVEN a TRANSFER type', function () {
      it('should successfully insert a TRANSFER type vendor', async function () {
        const main = await this.request().post('/vendors').send({
          name: this.randomName(),
          type: VendorType.Transfer,
        });

        expect(main.status).to.eqls(201);
      });
    });

    describe('GIVEN no name', function () {
      it('should throw an error', async function () {
        const main = await this.request().post('/vendors').send({
          name: null,
          type: VendorType.Seamless,
        });

        expect(main.status).to.eqls(400);
      });
    });

    describe('GIVEN no type', function () {
      it('should throw an error if no type', async function () {
        const main = await this.request().post('/vendors').send({
          name: this.randomName(),
          type: null,
        });

        expect(main.status).to.eqls(400);
      });
    });

    describe('GIVEN an invalid type', function () {
      it('should throw an error', async function () {
        const main = await this.request().post('/vendors').send({
          name: this.randomName(),
          type: 'qwe',
        });

        expect(main.status).to.eqls(400);
      });
    });

    describe('GIVEN an existing vendor name', function () {
      it('should throw an error', async function () {
        const name = this.randomName();
        const mock = await this.request().post('/vendors').send({
          name,
          type: VendorType.Seamless,
        });

        expect(mock.status).to.eqls(201);

        const main = await this.request().post('/vendors').send({
          name,
          type: VendorType.Seamless,
        });

        expect(main.status).to.eqls(400);
      });
    });
  });

  describe('GET /vendors', () => {
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

    it('should return list of vendors', async function () {
      const main = await this.request().get('/vendors');
      expect(main.status).to.eqls(200);
      expect(main.body.length).to.eqls(1);
    });
  });

  describe('GET /vendors/:id', () => {
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

    describe('GIVEN an existing and valid ID', () => {
      it('should return the vendor with that ID', async function () {
        const main = await this.request().get(`/vendors/${this.mock._id}`);

        expect(main.status).to.eqls(200);
      });
    });

    describe('GIVEN a non existent ID', () => {
      it(`should throw an error`, async function () {
        const main = await this.request().get(`/vendors/${this.mockedId}`);

        expect(main.status).to.eqls(400);
      });
    });
  });

  describe('PUT /vendors/:id', () => {
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

    describe('GIVEN a valid ID and TRANSFER type', () => {
      it('should successfully update to a TRANSFER vendor', async function () {
        const main = await this.request()
          .put(`/vendors/${this.mock._id}`)
          .send({
            name: this.randomName(),
            type: VendorType.Transfer,
          });

        expect(main.status).to.eqls(204);
      });
    });

    describe('GIVEN a valid ID and SEAMLESS type', () => {
      it('should successfully update to a SEAMLESS vendor', async function () {
        const main = await this.request()
          .put(`/vendors/${this.mock._id}`)
          .send({
            name: this.randomName(),
            type: VendorType.Seamless,
          });

        expect(main.status).to.eqls(204);
      });
    });

    describe('GIVEN non existent ID', () => {
      it(`should throw an error`, async function () {
        const main = await this.request()
          .put(`/vendors/${this.mockedId}`)
          .send({
            name: this.randomName(),
            type: VendorType.Seamless,
          });

        expect(main.status).to.eqls(400);
      });
    });

    describe('GIVEN no name', () => {
      it(`should throw an error`, async function () {
        const main = await this.request()
          .put(`/vendors/${this.mock._id}`)
          .send({
            name: null,
            type: VendorType.Seamless,
          });

        expect(main.status).to.eqls(400);
      });
    });

    describe('GIVEN no type', () => {
      it(`should throw an error`, async function () {
        const main = await this.request()
          .put(`/vendors/${this.mock._id}`)
          .send({
            name: this.randomName(),
            type: null,
          });

        expect(main.status).to.eqls(400);
      });
    });

    describe('GIVEN an invalid type', () => {
      it(`should throw an error`, async function () {
        const main = await this.request()
          .put(`/vendors/${this.mock._id}`)
          .send({
            name: this.randomName(),
            type: 'qwe',
          });

        expect(main.status).to.eqls(400);
      });
    });

    describe('DELETE /vendors/:id', () => {
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
        it(`should delete vendor and return it's ID`, async function () {
          const main = await this.request().delete(`/vendors/${this.mock._id}`);

          expect(main.status).to.eqls(200);
          expect(main.body).to.be.true;
        });
      });

      describe('GIVEN an invalid ID', () => {
        it(`should throw an error if id doensn't exist`, async function () {
          const main = await this.request().delete(`/vendors/${this.mockedId}`);

          expect(main.status).to.eqls(400);
        });
      });
    });
  });
});

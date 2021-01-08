/*eslint-disable */
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import server from '../src/index';

import { Vendor } from '../src/lib/mongoose/models/vendor';

chai.use(chaiHttp);

describe('Vendor Endpoints', function () {
  before(function () {
    this.request = () => chai.request(server.callback());
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
          name: 'Luis Angelo Belmonte',
          type: 'SEAMLESS',
        });
    
        expect(main.status).to.eqls(201);
      });
    });
    
    describe('GIVEN a TRANSFER type', function () {
      it('should successfully insert a TRANSFER type vendor', async function () {
        const main = await this.request().post('/vendors').send({
          name: 'Luis Angelo Belmonte',
          type: 'TRANSFER',
        });
    
        expect(main.status).to.eqls(201);
      });
    });
    
    describe('GIVEN no name', function () {
      it('should throw an error', async function () {
        const main = await this.request().post('/vendors').send({
          name: null,
          type: 'SEAMLESS',
        });
    
        expect(main.status).to.eqls(400);
      });
    });
    
    describe('GIVEN no type', function () {
      it('should throw an error if no type', async function () {
        const main = await this.request().post('/vendors').send({
          name: 'Luis Angelo Belmonte',
          type: null,
        });
    
        expect(main.status).to.eqls(400);
      });  
    });
    
    describe('GIVEN an invalid type', function () {
      it('should throw an error', async function () {
        const main = await this.request().post('/vendors').send({
          name: 'Luis Angelo Belmonte',
          type: 'qwe',
        });
    
        expect(main.status).to.eqls(400);
      });
    });
    
    
    describe('GIVEN a the same vendor name exists', function () {
      it('should throw an error', async function () {
  
        const mock = await this.request().post('/vendors').send({
          name: 'Luis Angelo Belmonte',
          type: 'SEAMLESS',
        });
    
        expect(mock.status).to.eqls(201);
    
        const main = await this.request().post('/vendors').send({
          name: 'Luis Angelo Belmonte',
          type: 'SEAMLESS',
        });
    
        expect(main.status).to.eqls(400);
      });
    });
  });
  
  describe('GET /vendors', () => {
    afterEach(() => {
      return Vendor.deleteMany({});
    });
  
    beforeEach(() => {
      return Vendor.deleteMany({});
    });
  
    it('should return list of vendors', async function () {
      const mock = await this.request().post('/vendors').send({
        name: 'Luis Angelo Belmonte',
        type: 'SEAMLESS',
      });
  
      expect(mock.status).to.eqls(201);
  
      const main = await this.request().get('/vendors');
  
      expect(main.status).to.eqls(200);
      expect(main.body.view.length).to.eqls(1);
    });
  });
  
  describe('GET /vendors/:id', () => {
    afterEach(() => {
      return Vendor.deleteMany({});
    });
  
    beforeEach(() => {
      return Vendor.deleteMany({});
    });
  
    it('should return vendor by ID', async function () {
      const mock = await this.request().post('/vendors').send({
        name: 'Luis Angelo Belmonte',
        type: 'SEAMLESS',
      });
  
      expect(mock.status).to.eqls(201);
  
      const main = await this.request().get(`/vendors/${mock.body.posted._id}`);
  
      expect(main.status).to.eqls(200);
    });
  
    it(`should throw an error if ID of the Vendor doesn't exist`, async function () {
      const mock = await this.request().post('/vendors').send({
        name: 'Luis Angelo Belmonte',
        type: 'SEAMLESS',
      });
  
      expect(mock.status).to.eqls(201);
  
      const main = await this.request().get('/vendors/154151547');
  
      expect(main.status).to.eqls(400);
    });
  });
  
  describe('PUT /vendors/:id', () => {
    afterEach(() => {
      return Vendor.deleteMany({});
    });
  
    beforeEach(() => {
      return Vendor.deleteMany({});
    });
  
    it('should successfully update to a TRANSFER vendor', async function () {
      const mock = await this.request().post('/vendors').send({
        name: 'Luis Angelo Belmonte',
        type: 'SEAMLESS',
      });
  
      expect(mock.status).to.eqls(201);
  
      const main = await this.request().put(`/vendors/${mock.body.posted._id}`).send({
        name: 'Luis Angelo Belmonte',
        type: 'TRANSFER',
      });
  
      expect(main.status).to.eqls(204);
    });
  
    it('should successfully update to a SEAMLESS vendor', async function () {
      const mock = await this.request().post('/vendors').send({
        name: 'Luis Angelo Belmonte',
        type: 'TRANSFER',
      });
  
      expect(mock.status).to.eqls(201);
  
      const main = await this.request().put(`/vendors/${mock.body.posted._id}`).send({
        name: 'Luis Angelo Belmonte',
        type: 'SEAMLESS',
      });
  
      expect(main.status).to.eqls(204);
    });
  
    it(`should throw an error if ID does'nt exist`, async function () {
      const mock = await this.request().post('/vendors').send({
        name: 'Luis Angelo Belmonte',
        type: 'SEAMLESS',
      });
  
      expect(mock.status).to.eqls(201);
  
      const main = await this.request().put('/vendors/154151547').send({
        name: 'Luis Angelo Belmonte',
        type: 'TRANSFER',
      });
  
      expect(main.status).to.eqls(400);
    });
  
    it(`should throw an error if no name is provided`, async function () {
      const mock = await this.request().post('/vendors').send({
        name: 'Luis Angelo Belmonte',
        type: 'SEAMLESS',
      });
  
      expect(mock.status).to.eqls(201);
  
      const main = await this.request().put(`/vendors/${mock.body.posted._id}`).send({
        name: null,
        type: 'TRANSFER',
      });
  
      expect(main.status).to.eqls(400);
    });
  
    it(`should throw an error if no type is provided`, async function () {
      const mock = await this.request().post('/vendors').send({
        name: 'Luis Angelo Belmonte',
        type: 'SEAMLESS',
      });
  
      expect(mock.status).to.eqls(201);
  
      const main = await this.request().put(`/vendors/${mock.body.posted._id}`).send({
        name: 'Luis Angelo Belmonte',
        type: null,
      });
  
      expect(main.status).to.eqls(400);
    });
  
    it(`should throw an error if invalid type is provided`, async function () {
      const mock = await this.request().post('/vendors').send({
        name: 'Luis Angelo Belmonte',
        type: 'SEAMLESS',
      });
  
      expect(mock.status).to.eqls(201);
  
      const main = await this.request().put(`/vendors/${mock.body.posted._id}`).send({
        name: 'Luis Angelo Belmonte',
        type: 'qwe',
      });
  
      expect(main.status).to.eqls(400);
    });
  
    describe('DELETE /vendors/:id', () => {
      afterEach(() => {
        return Vendor.deleteMany({});
      });
  
      beforeEach(() => {
        return Vendor.deleteMany({});
      });
  
      it('should delete vendor by id', async function () {
        const mock = await this.request().post('/vendors').send({
          name: 'Luis Angelo Belmonte',
          type: 'SEAMLESS',
        });
  
        expect(mock.status).to.eqls(201);
  
        const main = await this.request().delete(`/vendors/${mock.body.posted._id}`);
  
        expect(main.status).to.eqls(200);
        expect(main.body.deleted).to.be.true;
      });
  
      it(`should throw an error if id doensn't exist`, async function () {
        const mock = await this.request().post('/vendors').send({
          name: 'Luis Angelo Belmonte',
          type: 'SEAMLESS',
        });
  
        expect(mock.status).to.eqls(201);
  
        const main = await this.request().delete('/vendors/154151546')
  
        expect(main.status).to.eqls(400);
      });
    });
  });
});


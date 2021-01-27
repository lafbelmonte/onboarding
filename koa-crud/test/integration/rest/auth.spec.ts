import chai, { expect } from 'chai';

import chaiHttp from 'chai-http';

import { Chance } from 'chance';

import bcrypt from 'bcrypt';
import server from '../../../src/index';

import MemberModel from '../../../src/lib/mongoose/models/member';

import { closeDatabase, initializeDatabase } from '../../../src/lib/mongoose';

chai.use(chaiHttp);

const chance = new Chance();

describe('Auth Endpoints', () => {
  before(async function () {
    await initializeDatabase();
    this.mock = null;
    this.randomUsername = () => chance.word();
    this.randomPassword = () => chance.word();
    this.randomRealName = () => chance.name({ middle: true });

    this.validUsername = this.randomUsername();
    this.validPassword = this.randomPassword();

    await MemberModel.create({
      username: this.validUsername,
      password: await bcrypt.hash(this.validPassword, 10),
      realName: this.randomRealName(),
    });

    this.request = () => chai.request(server.callback());
  });

  after(async function () {
    await MemberModel.deleteMany({});
    await closeDatabase();
  });

  describe('POST /auth', () => {
    describe('GIVEN correct username and password', () => {
      it('should return success status code', async function () {
        const main = await this.request().post('/auth').send({
          username: this.validUsername,
          password: this.validPassword,
        });

        expect(main.status).to.eqls(200);
      });
    });

    describe('GIVEN incorrect username', () => {
      it('should return error status code', async function () {
        const main = await this.request().post('/auth').send({
          username: this.randomUsername(),
          password: this.validPassword,
        });

        expect(main.status).to.eqls(400);
        expect(main.body.code).eqls('INVALID_CREDENTIALS');
      });
    });

    describe('GIVEN incorrect password', () => {
      it('should return error status code', async function () {
        const main = await this.request().post('/auth').send({
          username: this.validUsername,
          password: this.randomPassword(),
        });

        expect(main.status).to.eqls(400);
        expect(main.body.code).eqls('INVALID_CREDENTIALS');
      });
    });

    describe('GIVEN no username', () => {
      it('should return error status code', async function () {
        const main = await this.request().post('/auth').send({
          username: '',
          password: this.validPassword,
        });

        expect(main.status).to.eqls(400);
        expect(main.body.code).eqls('MISSING_CREDENTIALS');
      });
    });

    describe('GIVEN no password', () => {
      it('should return error status code', async function () {
        const main = await this.request().post('/auth').send({
          username: this.validUsername,
          password: '',
        });

        expect(main.status).to.eqls(400);
        expect(main.body.code).eqls('MISSING_CREDENTIALS');
      });
    });
  });
});

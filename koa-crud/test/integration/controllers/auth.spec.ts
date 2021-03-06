import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import { Chance } from 'chance';

import bcrypt from 'bcrypt';

import { authenticateController } from '@controllers/auth';

import MemberModel from '@lib/mongoose/models/member';

import { initializeDatabase, closeDatabase } from '@lib/mongoose';

chai.use(chaiAsPromised);

const chance = new Chance();

describe('Auth Controllers', () => {
  before(async function () {
    this.mock = null;
    this.randomUsername = () => chance.word();
    this.randomPassword = () => chance.word();
    this.randomRealName = () => chance.name({ middle: true });
    await initializeDatabase();

    this.validUsername = this.randomUsername();
    this.validPassword = this.randomPassword();

    await MemberModel.create({
      username: this.validUsername,
      password: await bcrypt.hash(this.validPassword, 10),
      realName: this.randomRealName(),
    });
  });

  after(async function () {
    await MemberModel.deleteMany({});
    await closeDatabase();
  });

  describe('Member Authentication', () => {
    describe('GIVEN correct username and password', () => {
      it('should return success status code', async function () {
        this.mock = {
          body: {
            username: this.validUsername,
            password: this.validPassword,
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
          authenticateController(this.mock),
        ).to.eventually.fulfilled.property('statusCode', 200);
      });
    });

    describe('GIVEN incorrect username', () => {
      it('should return error status code', async function () {
        const username = this.randomUsername();
        this.mock = {
          body: {
            username,
            password: this.validPassword,
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
          authenticateController(this.mock),
        ).to.eventually.fulfilled.eqls({
          headers: { 'Content-Type': 'application/json' },
          statusCode: 400,
          body: {
            code: 'INVALID_CREDENTIALS',
            error: `Username: ${username} doesn't exists`,
          },
        });
      });
    });

    describe('GIVEN incorrect password', () => {
      it('should return error status code', async function () {
        this.mock = {
          body: {
            username: this.validUsername,
            password: this.randomPassword(),
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
          authenticateController(this.mock),
        ).to.eventually.fulfilled.eqls({
          headers: { 'Content-Type': 'application/json' },
          statusCode: 400,
          body: {
            code: 'INVALID_CREDENTIALS',
            error: `Incorrect password`,
          },
        });
      });
    });

    describe('GIVEN no username', () => {
      it('should return error status code', async function () {
        this.mock = {
          body: {
            username: '',
            password: this.validPassword,
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
          authenticateController(this.mock),
        ).to.eventually.fulfilled.eqls({
          headers: { 'Content-Type': 'application/json' },
          statusCode: 400,
          body: {
            code: 'MISSING_CREDENTIALS',
            error: `Please input username`,
          },
        });
      });
    });

    describe('GIVEN no password', () => {
      it('should return error status code', async function () {
        this.mock = {
          body: {
            username: this.validUsername,
            password: '',
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
          authenticateController(this.mock),
        ).to.eventually.fulfilled.eqls({
          headers: { 'Content-Type': 'application/json' },
          statusCode: 400,
          body: {
            code: 'MISSING_CREDENTIALS',
            error: `Please input password`,
          },
        });
      });
    });
  });
});

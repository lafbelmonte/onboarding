import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import { Chance } from 'chance';

import bcrypt from 'bcrypt';

import { authenticateUseCase } from '../../../src/use-cases/auth';

import { Member } from '../../../src/lib/mongoose/models/member';

import { initializeDatabase, closeDatabase } from '../../../src/lib/mongoose';

chai.use(chaiAsPromised);

const chance = new Chance();

describe('Auth Use Cases', () => {
  before(async function () {
    this.mock = null;
    this.randomUsername = () => chance.word();
    this.randomPassword = () => chance.word();
    this.randomRealName = () => chance.name({ middle: true });
    await initializeDatabase();

    this.validUsername = this.randomUsername();
    this.validPassword = this.randomPassword();

    await Member.create({
      username: this.validUsername,
      password: await bcrypt.hash(this.validPassword, 10),
      realName: this.randomRealName(),
    });
  });

  after(async function () {
    await Member.deleteMany({});
    await closeDatabase();
  });

  describe('Member Authentication', () => {
    describe('GIVEN correct username and password', () => {
      it('should be fulfilled', async function () {
        this.mock = {
          id: null,
          info: {
            username: this.validUsername,
            password: this.validPassword,
          },
          source: null,
        };

        await expect(authenticateUseCase(this.mock)).to.eventually.fulfilled;
      });
    });

    describe('GIVEN incorrect username', () => {
      it('should throw an error and be rejected', async function () {
        this.mock = {
          id: null,
          info: {
            username: this.randomUsername(),
            password: this.validPassword,
          },
          source: null,
        };

        await expect(authenticateUseCase(this.mock)).to.eventually.rejectedWith(
          'Invalid credentials',
        );
      });
    });

    describe('GIVEN incorrect password', () => {
      it('should throw an error and be rejected', async function () {
        this.mock = {
          id: null,
          info: {
            username: this.validUsername,
            password: this.randomPassword(),
          },
          source: null,
        };

        await expect(authenticateUseCase(this.mock)).to.eventually.rejectedWith(
          'Invalid credentials',
        );
      });
    });

    describe('GIVEN no username', () => {
      it('should throw an error and be rejected', async function () {
        this.mock = {
          id: null,
          info: {
            username: '',
            password: this.validPassword,
          },
          source: null,
        };

        await expect(authenticateUseCase(this.mock)).to.eventually.rejectedWith(
          'Please input username',
        );
      });
    });

    describe('GIVEN no password', () => {
      it('should throw an error and be rejected', async function () {
        this.mock = {
          id: null,
          info: {
            username: this.validUsername,
            password: '',
          },
          source: null,
        };

        await expect(authenticateUseCase(this.mock)).to.eventually.rejectedWith(
          'Please input password',
        );
      });
    });
  });
});

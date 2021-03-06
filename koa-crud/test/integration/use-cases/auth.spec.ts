import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import { Chance } from 'chance';

import bcrypt from 'bcrypt';

import { authenticateUseCase } from '@use-cases/auth';

import MemberModel from '@lib/mongoose/models/member';

import { initializeDatabase, closeDatabase } from '@lib/mongoose';

import {
  MissingCredentialsError,
  InvalidCredentialsError,
} from '@custom-errors';

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

    describe('GIVEN non existent username', () => {
      it('should throw an error and be rejected', async function () {
        const username = this.randomUsername();
        this.mock = {
          id: null,
          info: {
            username,
            password: this.validPassword,
          },
          source: null,
        };

        await expect(authenticateUseCase(this.mock))
          .to.eventually.rejectedWith(`Username: ${username} doesn't exists`)
          .and.be.an.instanceOf(InvalidCredentialsError);
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

        await expect(authenticateUseCase(this.mock))
          .to.eventually.rejectedWith('Incorrect password')
          .and.be.an.instanceOf(InvalidCredentialsError);
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

        await expect(authenticateUseCase(this.mock))
          .to.eventually.rejectedWith('Please input username')
          .and.be.an.instanceOf(MissingCredentialsError);
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

        await expect(authenticateUseCase(this.mock))
          .to.eventually.rejectedWith('Please input password')
          .and.be.an.instanceOf(MissingCredentialsError);
      });
    });
  });
});

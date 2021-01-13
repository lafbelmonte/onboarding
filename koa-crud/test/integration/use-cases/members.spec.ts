import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import mongoose from 'mongoose';

import { Chance } from 'chance';
import { insertMemberUseCase } from '../../../src/use-cases/members';

import { Member } from '../../../src/lib/mongoose/models/member';

import { initializeDatabase } from '../../../src/lib/mongoose';

chai.use(chaiAsPromised);

const chance = new Chance();

describe('Member Use Cases', () => {
  before(async function () {
    this.mockedId = mongoose.Types.ObjectId().toString();
    this.mock = null;
    this.randomRealName = () => chance.name({ middle: true });
    this.randomUsername = () => chance.word();
    this.randomPassword = () => chance.word();
    await initializeDatabase();
  });

  describe('Adding a Member', () => {
    afterEach(() => {
      return Member.deleteMany({});
    });

    beforeEach(() => {
      return Member.deleteMany({});
    });

    describe('GIVEN correct inputs', () => {
      it('should return true', async function () {
        this.mock = {
          id: null,
          info: {
            username: this.randomUsername(),
            password: this.randomPassword(),
            realName: this.randomRealName(),
          },
          source: null,
        };

        await expect(insertMemberUseCase(this.mock)).to.eventually.fulfilled.and
          .be.true;
      });
    });

    describe('GIVEN no username', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: null,
          info: {
            username: '',
            password: this.randomPassword(),
            realName: this.randomRealName(),
          },
          source: null,
        };

        await expect(insertMemberUseCase(this.mock)).to.eventually.rejectedWith(
          'Please input username',
        );
      });
    });

    describe('GIVEN no password', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: null,
          info: {
            username: this.randomUsername(),
            password: '',
            realName: this.randomRealName(),
          },
          source: null,
        };

        await expect(insertMemberUseCase(this.mock)).to.eventually.rejectedWith(
          'Please input password',
        );
      });
    });

    describe('GIVEN existing username', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: null,
          info: {
            username: this.randomUsername(),
            password: this.randomPassword(),
            realName: this.randomRealName(),
          },
          source: null,
        };

        await expect(insertMemberUseCase(this.mock)).to.eventually.fulfilled.and
          .be.true;
        await expect(insertMemberUseCase(this.mock)).to.eventually.rejectedWith(
          'Username already exists',
        );
      });
    });
  });
});

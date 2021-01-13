import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import mongoose from 'mongoose';

import { Chance } from 'chance';
import { initializeDatabase } from '../../../src/lib/mongoose';

import { Member } from '../../../src/lib/mongoose/models/member';

chai.use(chaiAsPromised);

const chance = new Chance();

describe('Member Models', () => {
  before(async function () {
    this.randomRealName = () => chance.name({ middle: true });
    this.randomUsername = () => chance.word();
    this.randomPassword = () => chance.word();
    this.mock = null;
    this.mockedId = mongoose.Types.ObjectId().toString();
    await initializeDatabase();
  });

  describe('Creating a member', () => {
    afterEach(() => {
      return Member.deleteMany({});
    });

    beforeEach(() => {
      return Member.deleteMany({});
    });

    describe('GIVEN correct inputs', () => {
      it('should be fulfilled', async function () {
        this.mock = {
          username: this.randomUsername(),
          password: this.randomPassword(),
          realName: this.randomRealName(),
        };
        await expect(Member.create(this.mock)).to.eventually.fulfilled;
      });
    });

    describe('GIVEN no username', () => {
      it('should be rejected', async function () {
        this.mock = {
          username: '',
          password: this.randomPassword(),
          realName: this.randomRealName(),
        };
        await expect(Member.create(this.mock)).to.eventually.rejected;
      });
    });

    describe('GIVEN no password', () => {
      it('should be rejected', async function () {
        this.mock = {
          username: this.randomUsername(),
          password: '',
          realName: this.randomRealName(),
        };
        await expect(Member.create(this.mock)).to.eventually.rejected;
      });
    });
  });
});

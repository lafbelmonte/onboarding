import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import mongoose from 'mongoose';

import { Chance } from 'chance';
import { initializeDatabase, closeDatabase } from '../../../src/lib/mongoose';

import MemberModel from '../../../src/lib/mongoose/models/member';

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
  after(async function () {
    await closeDatabase();
  });

  describe('Creating a member', () => {
    afterEach(() => {
      return MemberModel.deleteMany({});
    });

    beforeEach(() => {
      return MemberModel.deleteMany({});
    });

    describe('GIVEN correct inputs', () => {
      it('should be fulfilled', async function () {
        this.mock = {
          username: this.randomUsername(),
          password: this.randomPassword(),
          realName: this.randomRealName(),
        };
        await expect(MemberModel.create(this.mock)).to.eventually.fulfilled;
      });
    });

    describe('GIVEN no username', () => {
      it('should be rejected', async function () {
        this.mock = {
          username: '',
          password: this.randomPassword(),
          realName: this.randomRealName(),
        };
        await expect(MemberModel.create(this.mock)).to.eventually.rejected;
      });
    });

    describe('GIVEN no password', () => {
      it('should be rejected', async function () {
        this.mock = {
          username: this.randomUsername(),
          password: '',
          realName: this.randomRealName(),
        };
        await expect(MemberModel.create(this.mock)).to.eventually.rejected;
      });
    });
  });

  describe('Updating a member', () => {
    after(() => {
      return MemberModel.deleteMany({});
    });

    before(async function () {
      await MemberModel.deleteMany({});
      this.mock = await MemberModel.create({
        username: this.randomUsername(),
        password: this.randomPassword(),
        realName: this.randomRealName(),
      });

      this.baseId = this.mock._id;
    });

    describe('GIVEN correct inputs', () => {
      it('should be fulfilled', async function () {
        this.mock = {
          username: this.randomUsername(),
          password: this.randomPassword(),
          realName: this.randomRealName(),
        };
        await expect(
          MemberModel.findOneAndUpdate({ _id: this.baseId }, this.mock, {
            new: true,
          }),
        ).to.eventually.fulfilled;
      });
    });

    describe('GIVEN no username', () => {
      it('should be rejected', async function () {
        this.mock = {
          username: '',
          password: this.randomPassword(),
          realName: this.randomRealName(),
        };
        await expect(
          MemberModel.findOneAndUpdate({ _id: this.baseId }, this.mock, {
            new: true,
          }),
        ).to.eventually.rejected;
      });
    });

    describe('GIVEN no password', () => {
      it('should be rejected', async function () {
        this.mock = {
          username: this.randomUsername(),
          password: '',
          realName: this.randomRealName(),
        };
        await expect(
          MemberModel.findOneAndUpdate({ _id: this.baseId }, this.mock, {
            new: true,
          }),
        ).to.eventually.rejected;
      });
    });
  });

  describe('Delete One Member', () => {
    afterEach(() => {
      return MemberModel.deleteMany({});
    });

    beforeEach(() => {
      return MemberModel.deleteMany({});
    });

    describe('GIVEN existent vendor ID', () => {
      it('should be fulfilled and deleted count should be 1', async function () {
        this.mock = {
          username: this.randomUsername(),
          password: this.randomPassword(),
          realName: this.randomRealName(),
        };
        const main = await expect(MemberModel.create(this.mock)).to.eventually
          .fulfilled;

        await expect(
          MemberModel.deleteOne({ _id: main._id }),
        ).to.eventually.fulfilled.property('deletedCount', 1);
      });
    });

    describe('GIVEN non existent vendor ID', () => {
      it('should be fulfilled and deleted count should be 0', async function () {
        this.mock = {
          username: this.randomUsername(),
          password: this.randomPassword(),
          realName: this.randomRealName(),
        };
        await expect(MemberModel.create(this.mock)).to.eventually.fulfilled;

        await expect(
          MemberModel.deleteOne({ _id: this.mockedId }),
        ).to.eventually.fulfilled.property('deletedCount', 0);
      });
    });
  });
});

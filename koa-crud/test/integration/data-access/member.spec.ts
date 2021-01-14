import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import mongoose from 'mongoose';

import { Chance } from 'chance';
import { Member } from '../../../src/lib/mongoose/models/member';

import { membersStore } from '../../../src/data-access/mongoose/members';

import { initializeDatabase } from '../../../src/lib/mongoose';

chai.use(chaiAsPromised);

const chance = new Chance();

const {
  insertOneMember,
  memberExistsByFilter,
  selectOneMemberByFilters,
  selectAllMembers,
  updateMemberByFilters,
  deleteOneMember
} = membersStore;

describe('Member Store', () => {
  before(async function () {
    this.mock = null;
    this.randomRealName = () => chance.name({ middle: true });
    this.randomUsername = () => chance.word();
    this.randomPassword = () => chance.word();
    this.mockedId = mongoose.Types.ObjectId().toString();
    await initializeDatabase();
  });

  describe('Insert one Member', () => {
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
        await expect(insertOneMember(this.mock)).to.eventually.fulfilled;
      });
    });

    describe('GIVEN no username', () => {
      it('should be rejected', async function () {
        this.mock = {
          username: '',
          password: this.randomPassword(),
          realName: this.randomRealName(),
        };
        await expect(insertOneMember(this.mock)).to.eventually.rejected;
      });
    });

    describe('GIVEN no password', () => {
      it('should be rejected', async function () {
        this.mock = {
          username: this.randomUsername(),
          password: '',
          realName: this.randomRealName(),
        };
        await expect(insertOneMember(this.mock)).to.eventually.rejected;
      });
    });
  });

  describe('Member exists? By filters', () => {
    after(() => {
      return Member.deleteMany({});
    });

    before(async function () {
      await Member.deleteMany({});
      this.mock = await Member.create({
        username: this.randomUsername(),
        password: this.randomPassword(),
        realName: this.randomRealName(),
      });
    });
    describe('GIVEN existent filters', () => {
      it('should return true', async function () {
        await expect(memberExistsByFilter({ _id: this.mock._id })).to.eventually
          .fulfilled.be.true;
      });
    });

    describe('GIVEN non existent filters', () => {
      it('should return false', async function () {
        await expect(memberExistsByFilter({ _id: this.mockedId })).to.eventually
          .fulfilled.be.false;
      });
    });
  });

  describe('Select All Members', () => {
    after(() => {
      return Member.deleteMany({});
    });

    before(async function () {
      await Member.deleteMany({});
      this.mock = await Member.create({
        username: this.randomUsername(),
        password: this.randomPassword(),
        realName: this.randomRealName(),
      });
    });

    it('should return a list of members', async () => {
      await expect(selectAllMembers()).eventually.fulfilled.and.have.length(1);
    });
  });

  describe('Select One Member By Filters', () => {
    after(() => {
      return Member.deleteMany({});
    });

    before(async function () {
      await Member.deleteMany({});
      this.mock = await Member.create({
        username: this.randomUsername(),
        password: this.randomPassword(),
        realName: this.randomRealName(),
      });
    });

    describe('GIVEN existent filters', () => {
      it('should return the member', async function () {
        await expect(
          selectOneMemberByFilters({ _id: this.mock._id }),
        ).to.eventually.fulfilled.property('_id', this.mock._id);
      });
    });

    describe('GIVEN non existent filters', () => {
      it('should return null', async function () {
        await expect(selectOneMemberByFilters({ _id: this.mockedId })).to
          .eventually.fulfilled.and.null;
      });
    });
  });

  describe('Update member by filters', () => {
    after(() => {
      return Member.deleteMany({});
    });

    before(async function () {
      await Member.deleteMany({});
      this.mock = await Member.create({
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

        await expect(updateMemberByFilters({ _id: this.baseId }, this.mock)).to
          .eventually.fulfilled;
      });
    });

    describe('GIVEN no username', () => {
      it('should be rejected', async function () {
        this.mock = {
          username: '',
          password: this.randomPassword(),
          realName: this.randomRealName(),
        };

        await expect(updateMemberByFilters({ _id: this.baseId }, this.mock)).to
          .eventually.rejected;
      });
    });

    describe('GIVEN no username', () => {
      it('should be rejected', async function () {
        this.mock = {
          username: this.randomUsername(),
          password: '',
          realName: this.randomRealName(),
        };
        await expect(updateMemberByFilters({ _id: this.baseId }, this.mock)).to
          .eventually.rejected;
      });
    });
  });

  describe('Deleting a Member', () => {
    after(() => {
      return Member.deleteMany({});
    });

    before(async function () {
      await Member.deleteMany({});
      this.mock = await Member.create({
        username: this.randomUsername(),
        password: this.randomPassword(),
        realName: this.randomRealName(),
      });

      this.baseId = this.mock._id;
    });

    describe('GIVEN valid and existent vendor ID', () => {
      it('should return true', async function () {
        await expect(deleteOneMember({ _id: this.mock._id })).to.eventually
          .fulfilled.and.be.true;
      });
    });

    describe('GIVEN non existent vendor ID', () => {
      it('should return false', async function () {
        await expect(deleteOneMember({ _id: this.mockedId })).to.eventually
          .fulfilled.and.be.false;
      });
    });
  });

});

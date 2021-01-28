import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import mongoose from 'mongoose';

import { Chance } from 'chance';
import {
  insertMemberUseCase,
  selectAllMembersUseCase,
  selectOneMemberUseCase,
  updateMemberUseCase,
  deleteOneMemberUseCase,
} from '@use-cases/members';

import MemberModel from '@lib/mongoose/models/member';

import { initializeDatabase, closeDatabase } from '@lib/mongoose';

import {
  MissingMemberInformationError,
  ExistingMemberError,
  MemberNotFoundError,
} from '@custom-errors';

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

  after(async function () {
    await closeDatabase();
  });
  describe('Adding a Member', () => {
    afterEach(() => {
      return MemberModel.deleteMany({});
    });

    beforeEach(() => {
      return MemberModel.deleteMany({});
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

        await expect(insertMemberUseCase(this.mock))
          .to.eventually.rejectedWith('Please input username')
          .and.be.an.instanceOf(MissingMemberInformationError);
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

        await expect(insertMemberUseCase(this.mock))
          .to.eventually.rejectedWith('Please input password')
          .and.be.an.instanceOf(MissingMemberInformationError);
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
        await expect(insertMemberUseCase(this.mock))
          .to.eventually.rejectedWith(
            `Username: ${this.mock.info.username} already exists`,
          )
          .and.be.an.instanceOf(ExistingMemberError);
      });
    });
  });

  describe('Selecting All Members', () => {
    after(() => {
      return MemberModel.deleteMany({});
    });

    before(async function () {
      await MemberModel.deleteMany({});
      this.mock = {
        username: this.randomUsername(),
        password: this.randomPassword(),
        realName: this.randomRealName(),
      };
      await MemberModel.create(this.mock);
    });

    it('should return list of members', async function () {
      await expect(
        selectAllMembersUseCase({ id: null, info: null, source: null }),
      ).to.eventually.fulfilled.and.length(1);
    });
  });

  describe('Selecting One Member', () => {
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
    });

    describe('GIVEN valid ID', () => {
      it('should return the member corresponding with the GIVEN ID', async function () {
        await expect(
          selectOneMemberUseCase({
            id: this.mock._id,
            info: null,
            source: null,
          }),
        ).to.eventually.fulfilled.property('_id', this.mock._id);
      });
    });

    describe('GIVEN non existent ID', () => {
      it('should throw an error', async function () {
        await expect(
          selectOneMemberUseCase({
            id: this.mockedId,
            info: null,
            source: null,
          }),
        )
          .to.eventually.rejectedWith(
            `Member with ID: ${this.mockedId} doesn't exists`,
          )
          .and.be.an.instanceOf(MemberNotFoundError);
      });
    });
  });

  describe('Updating Member', () => {
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
    });

    describe('GIVEN correct input', () => {
      it('should return true', async function () {
        await expect(
          updateMemberUseCase({
            id: this.mock._id,
            info: {
              username: this.randomUsername(),

              realName: this.randomRealName(),
            },
            source: null,
          }),
        ).to.eventually.fulfilled.and.be.true;
      });
    });

    describe('GIVEN no username', () => {
      it('should throw an error', async function () {
        await expect(
          updateMemberUseCase({
            id: this.mock._id,
            info: {
              username: '',

              realName: this.randomRealName(),
            },
            source: null,
          }),
        )
          .to.eventually.rejectedWith('Please input username')
          .and.be.an.instanceOf(MissingMemberInformationError);
      });
    });

    describe('GIVEN non existent ID', () => {
      it('should throw an error', async function () {
        await expect(
          updateMemberUseCase({
            id: this.mockedId,
            info: {
              username: this.randomUsername(),

              realName: this.randomRealName(),
            },
            source: null,
          }),
        )
          .to.eventually.rejectedWith(
            `Member with ID: ${this.mockedId} doesn't exists`,
          )
          .and.be.an.instanceOf(MemberNotFoundError);
      });
    });

    describe('GIVEN existing username', () => {
      it('should throw an error', async function () {
        const data = await MemberModel.create({
          username: this.randomUsername(),
          password: this.randomPassword(),
          realName: this.randomRealName(),
        });

        await expect(
          updateMemberUseCase({
            id: this.mock._id,
            info: {
              username: data.username,

              realName: this.randomRealName(),
            },
            source: null,
          }),
        )
          .to.eventually.rejectedWith(
            `Username: ${data.username} already exists`,
          )
          .and.be.an.instanceOf(ExistingMemberError);
      });
    });
  });

  describe('Deleting a Member', () => {
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
    });

    describe('GIVEN a valid ID', () => {
      it('should return true', async function () {
        await expect(
          deleteOneMemberUseCase({
            id: this.mock._id,
            source: null,
            info: null,
          }),
        ).to.eventually.fulfilled.and.be.true;
      });
    });

    describe('GIVEN a non existent ID', () => {
      it('should throw an error', async function () {
        await expect(
          deleteOneMemberUseCase({
            id: this.mockedId,
            source: null,
            info: null,
          }),
        )
          .to.eventually.rejectedWith(
            `Member with ID: ${this.mockedId} doesn't exists`,
          )
          .and.be.an.instanceOf(MemberNotFoundError);
      });
    });
  });
});

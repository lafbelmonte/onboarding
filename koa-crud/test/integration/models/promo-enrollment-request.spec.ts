import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import bcrypt from 'bcrypt';

import mongoose from 'mongoose';

import { Chance } from 'chance';

import MemberModel from '@lib/mongoose/models/member';
import PromoModel, {
  PromoTemplate,
  PromoStatus,
  RequiredMemberFields,
} from '@lib/mongoose/models/promo';
import PromoEnrollmentRequestModel, {
  PromoEnrollmentRequestStatus,
} from '@lib/mongoose/models/promo-enrollment-request';

import { initializeDatabase, closeDatabase } from '@lib/mongoose';

chai.use(chaiAsPromised);

const chance = new Chance();

describe('Promo Enrollment Model', function () {
  before(async function () {
    await initializeDatabase();
    this.mockedId = mongoose.Types.ObjectId().toString();
    this.mock = null;

    this.randomString = () => chance.word();

    const member = await MemberModel.create({
      username: this.randomString(),
      password: await bcrypt.hash(this.randomString(), 10),
      realName: this.randomString(),
      email: this.randomString(),
      bankAccount: this.randomString(),
      balance: 26,
    });

    this.member = member;
  });

  after(async function () {
    await MemberModel.deleteMany({});
    await closeDatabase();
  });

  describe('Enroll Member to a Promo', () => {
    before(async function () {
      const depositMock = await PromoModel.create({
        name: this.randomString(),
        template: PromoTemplate.Deposit,
        title: this.randomString(),
        description: this.randomString(),
        minimumBalance: 25,
        status: PromoStatus.Active,
      });

      const signUpMock = await PromoModel.create({
        name: this.randomString(),
        template: PromoTemplate.SignUp,
        title: this.randomString(),
        description: this.randomString(),
        requiredMemberFields: [
          RequiredMemberFields.BankAccount,
          RequiredMemberFields.Email,
          RequiredMemberFields.Realname,
        ],
        status: PromoStatus.Active,
      });
      this.depositMockId = depositMock._id;
      this.signUpMockId = signUpMock._id;
    });

    after(() => {
      return PromoModel.deleteMany({});
    });

    afterEach(() => {
      return PromoEnrollmentRequestModel.deleteMany({});
    });

    beforeEach(() => {
      return PromoEnrollmentRequestModel.deleteMany({});
    });

    describe('Given promo and member with no status', () => {
      it('should be fulfilled and have status of PENDING', async function () {
        this.mock = {
          promo: this.depositMockId,
          member: this.member._id,
        };

        await expect(
          PromoEnrollmentRequestModel.create(this.mock),
        ).to.eventually.fulfilled.property(
          'status',
          PromoEnrollmentRequestStatus.Pending,
        );
      });
    });

    describe('Given promo and member status', () => {
      it('should be fulfilled and have status of Approved', async function () {
        this.mock = {
          promo: this.depositMockId,
          member: this.member._id,
          status: PromoEnrollmentRequestStatus.Approved,
        };

        await expect(
          PromoEnrollmentRequestModel.create(this.mock),
        ).to.eventually.fulfilled.property(
          'status',
          PromoEnrollmentRequestStatus.Approved,
        );
      });
    });

    describe('Given no promo', () => {
      it('should be rejected', async function () {
        this.mock = {
          member: this.member._id,
        };

        await expect(PromoEnrollmentRequestModel.create(this.mock)).to
          .eventually.rejected;
      });
    });

    describe('Given no member', () => {
      it('should be rejected', async function () {
        this.mock = {
          promo: this.depositMockId,
        };

        await expect(PromoEnrollmentRequestModel.create(this.mock)).to
          .eventually.rejected;
      });
    });

    describe('Given invalid status', () => {
      it('should be rejected', async function () {
        this.mock = {
          promo: this.depositMockId,
          member: this.member._id,
          status: this.randomString(),
        };

        await expect(PromoEnrollmentRequestModel.create(this.mock)).to
          .eventually.rejected;
      });
    });
  });

  describe(`Updating  Status of Promo Enrollment Request`, () => {
    before(async function () {
      const depositMock = await PromoModel.create({
        name: this.randomString(),
        template: PromoTemplate.Deposit,
        title: this.randomString(),
        description: this.randomString(),
        minimumBalance: 25,
        status: PromoStatus.Active,
      });

      const signUpMock = await PromoModel.create({
        name: this.randomString(),
        template: PromoTemplate.SignUp,
        title: this.randomString(),
        description: this.randomString(),
        requiredMemberFields: [
          RequiredMemberFields.BankAccount,
          RequiredMemberFields.Email,
          RequiredMemberFields.Realname,
        ],
        status: PromoStatus.Active,
      });
      this.depositMockId = depositMock._id;
      this.signUpMockId = signUpMock._id;

      const promoEnrollmentRequestDeposit = await PromoEnrollmentRequestModel.create(
        {
          member: this.member._id,
          promo: this.depositMockId,
        },
      );

      const promoEnrollmentRequestSignUp = await PromoEnrollmentRequestModel.create(
        {
          member: this.member._id,
          promo: this.signUpMockId,
        },
      );

      this.promoEnrollmentRequestDepositId = promoEnrollmentRequestDeposit._id;
      this.promoEnrollmentRequestSignUpId = promoEnrollmentRequestSignUp._id;
    });

    after(async () => {
      await PromoEnrollmentRequestModel.deleteMany({});
      return PromoModel.deleteMany({});
    });

    describe('Given Approve Status', () => {
      it('should return the promo enrollment request with approved status', async function () {
        await expect(
          PromoEnrollmentRequestModel.findOneAndUpdate(
            { _id: this.promoEnrollmentRequestDepositId },
            { status: PromoEnrollmentRequestStatus.Approved },
            {
              new: true,
            },
          ),
        ).to.eventually.fulfilled.property(
          'status',
          PromoEnrollmentRequestStatus.Approved,
        );
      });
    });

    describe('Given Rejected Status', () => {
      it('should return the promo enrollment request with approved status', async function () {
        await expect(
          PromoEnrollmentRequestModel.findOneAndUpdate(
            { _id: this.promoEnrollmentRequestDepositId },
            { status: PromoEnrollmentRequestStatus.Rejected },
            { new: true },
          ),
        ).to.eventually.fulfilled.property(
          'status',
          PromoEnrollmentRequestStatus.Rejected,
        );
      });
    });

    describe('Given Processing Status', () => {
      it('should return the promo enrollment request with approved status', async function () {
        await expect(
          PromoEnrollmentRequestModel.findOneAndUpdate(
            { _id: this.promoEnrollmentRequestDepositId },
            { status: PromoEnrollmentRequestStatus.Processing },
            { new: true },
          ),
        ).to.eventually.fulfilled.property(
          'status',
          PromoEnrollmentRequestStatus.Processing,
        );
      });
    });

    describe('Given Invalid Status', () => {
      it('should be rejected', async function () {
        await expect(
          PromoEnrollmentRequestModel.findOneAndUpdate(
            { _id: this.promoEnrollmentRequestDepositId },
            { status: this.randomString() },
            { new: true },
          ),
        ).to.eventually.rejected;
      });
    });
  });
});

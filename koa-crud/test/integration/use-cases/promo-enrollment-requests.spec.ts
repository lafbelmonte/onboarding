import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import bcrypt from 'bcrypt';

import mongoose from 'mongoose';

import { Chance } from 'chance';
import {
  enrollToPromoUseCase,
  selectAllPromoEnrollmentRequestsUseCase,
  selectOnePromoEnrollmentRequestUseCase,
  approveEnrollmentRequestUseCase,
  processEnrollmentRequestUseCase,
  rejectEnrollmentRequestUseCase,
} from '../../../src/use-cases/promo-enrollment-requests';

import { Member } from '../../../src/lib/mongoose/models/member';
import { Promo } from '../../../src/lib/mongoose/models/promo';
import { PromoEnrollmentRequest } from '../../../src/lib/mongoose/models/promo-enrollment-request';

import { initializeDatabase, closeDatabase } from '../../../src/lib/mongoose';

import {
  PromoTemplate,
  PromoStatus,
  RequiredMemberFields,
} from '../../../src/types';

import {
  MissingPromoEnrollmentRequestInformationError,
  PromoNotFoundError,
  ExistingEnrollmentError,
  NotEnoughBalanceError,
  RequiredMemberFieldsNotMetError,
  InvalidPromoError,
  MissingPromoInformationError,
  PromoEnrollmentRequestNotFoundError,
} from '../../../src/custom-errors';

chai.use(chaiAsPromised);

const chance = new Chance();

describe('Promo Enrollment Use Cases', function () {
  before(async function () {
    await initializeDatabase();
    this.mockedId = mongoose.Types.ObjectId().toString();
    this.mock = null;

    this.randomString = () => chance.word();

    const member = await Member.create({
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
    await Member.deleteMany({});
    await closeDatabase();
  });

  describe('Enroll Member to a Promo', () => {
    before(async function () {
      const depositMock = await Promo.create({
        name: this.randomString(),
        template: PromoTemplate.Deposit,
        title: this.randomString(),
        description: this.randomString(),
        minimumBalance: 25,
        status: PromoStatus.Active,
      });

      const signUpMock = await Promo.create({
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
      return Promo.deleteMany({});
    });

    afterEach(() => {
      return PromoEnrollmentRequest.deleteMany({});
    });

    beforeEach(() => {
      return PromoEnrollmentRequest.deleteMany({});
    });

    describe('Given valid member to enroll to a deposit promo', () => {
      it('should return true', async function () {
        this.mock = {
          id: this.member._id,
          info: {
            promo: this.depositMockId,
          },
          source: null,
        };

        await expect(enrollToPromoUseCase(this.mock)).to.eventually.fulfilled
          .and.be.true;
      });
    });

    describe('Given valid member to enroll to a sign promo', () => {
      it('should return true', async function () {
        this.mock = {
          id: this.member._id,
          info: {
            promo: this.signUpMockId,
          },
          source: null,
        };

        await expect(enrollToPromoUseCase(this.mock)).to.eventually.fulfilled
          .and.be.true;
      });
    });

    describe('Given no promo', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: this.member._id,
          info: {
            promo: '',
          },
          source: null,
        };

        await expect(enrollToPromoUseCase(this.mock))
          .to.eventually.rejectedWith('Please input promo ID')
          .and.be.an.instanceOf(MissingPromoEnrollmentRequestInformationError);
      });
    });

    describe('Given non existent promo', () => {
      it('should throw an error', async function () {
        const promo = this.randomString();
        this.mock = {
          id: this.member._id,
          info: {
            promo,
          },
          source: null,
        };

        await expect(enrollToPromoUseCase(this.mock))
          .to.eventually.rejectedWith(`Promo with ID: ${promo} doesn't exists`)
          .and.be.an.instanceOf(PromoNotFoundError);
      });
    });

    describe('Given non existent promo', () => {
      it('should throw an error', async function () {
        const promo = this.randomString();
        this.mock = {
          id: this.member._id,
          info: {
            promo,
          },
          source: null,
        };

        await expect(enrollToPromoUseCase(this.mock))
          .to.eventually.rejectedWith(`Promo with ID: ${promo} doesn't exists`)
          .and.be.an.instanceOf(PromoNotFoundError);
      });
    });

    describe('Given enrolled already promo', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: this.member._id,
          info: {
            promo: this.depositMockId,
          },
          source: null,
        };

        await enrollToPromoUseCase(this.mock);

        await expect(enrollToPromoUseCase(this.mock))
          .to.eventually.rejectedWith(
            'Member is already enrolled in this promo',
          )
          .and.be.an.instanceOf(ExistingEnrollmentError);
      });
    });
    describe('Given member with not enough balance to enroll to a deposit promo', () => {
      it('should throw an error', async function () {
        await Member.findOneAndUpdate(
          { _id: this.member._id },
          { balance: 24 },
        );

        this.mock = {
          id: this.member._id,
          info: {
            promo: this.depositMockId,
          },
          source: null,
        };

        await expect(enrollToPromoUseCase(this.mock))
          .to.eventually.rejectedWith(
            `Member doesn't have enough balance to enroll in this promo`,
          )
          .and.be.an.instanceOf(NotEnoughBalanceError);
      });
    });

    describe('Given member with no email to enroll to a sign up promo', () => {
      it('should throw an error', async function () {
        await Member.findOneAndUpdate(
          { _id: this.member._id },
          {
            realName: this.randomString(),
            email: null,
            bankAccount: this.randomString(),
          },
        );

        this.mock = {
          id: this.member._id,
          info: {
            promo: this.signUpMockId,
          },
          source: null,
        };

        await expect(enrollToPromoUseCase(this.mock))
          .to.eventually.rejectedWith(`Required member field EMAIL is missing`)
          .and.be.an.instanceOf(RequiredMemberFieldsNotMetError);
      });
    });

    describe('Given member with no real name to enroll to a sign up promo', () => {
      it('should throw an error', async function () {
        await Member.findOneAndUpdate(
          { _id: this.member._id },
          {
            realName: null,
            email: this.randomString(),
            bankAccount: this.randomString(),
          },
        );

        this.mock = {
          id: this.member._id,
          info: {
            promo: this.signUpMockId,
          },
          source: null,
        };

        await expect(enrollToPromoUseCase(this.mock))
          .to.eventually.rejectedWith(
            `Required member field REAL_NAME is missing`,
          )
          .and.be.an.instanceOf(RequiredMemberFieldsNotMetError);
      });
    });

    describe('Given member with no bank account to enroll to a sign up promo', () => {
      it('should throw an error', async function () {
        await Member.findOneAndUpdate(
          { _id: this.member._id },
          {
            realName: this.randomString(),
            email: this.randomString(),
            bankAccount: null,
          },
        );

        this.mock = {
          id: this.member._id,
          info: {
            promo: this.signUpMockId,
          },
          source: null,
        };

        await expect(enrollToPromoUseCase(this.mock))
          .to.eventually.rejectedWith(
            `Required member field BANK_ACCOUNT is missing`,
          )
          .and.be.an.instanceOf(RequiredMemberFieldsNotMetError);
      });
    });

    describe('Given inactive promo', () => {
      it('should throw an error', async function () {
        await Promo.findOneAndUpdate(
          { _id: this.signUpMockId },
          {
            status: PromoStatus.Inactive,
          },
        );

        this.mock = {
          id: this.member._id,
          info: {
            promo: this.signUpMockId,
          },
          source: null,
        };

        await expect(enrollToPromoUseCase(this.mock))
          .to.eventually.rejectedWith(
            `Promo with ID: ${this.signUpMockId} not active`,
          )
          .and.be.an.instanceOf(InvalidPromoError);
      });
    });

    describe('Given draft promo', () => {
      it('should throw an error', async function () {
        await Promo.findOneAndUpdate(
          { _id: this.signUpMockId },
          {
            status: PromoStatus.Draft,
          },
        );

        this.mock = {
          id: this.member._id,
          info: {
            promo: this.signUpMockId,
          },
          source: null,
        };

        await expect(enrollToPromoUseCase(this.mock))
          .to.eventually.rejectedWith(
            `Promo with ID: ${this.signUpMockId} not active`,
          )
          .and.be.an.instanceOf(InvalidPromoError);
      });
    });

    describe('Given not set minimum balance deposit promo', () => {
      it('should throw an error', async function () {
        await Promo.findOneAndUpdate(
          { _id: this.depositMockId },
          {
            minimumBalance: null,
          },
        );

        this.mock = {
          id: this.member._id,
          info: {
            promo: this.depositMockId,
          },
          source: null,
        };

        await expect(enrollToPromoUseCase(this.mock))
          .to.eventually.rejectedWith(`Minimum balance not set in the promo`)
          .and.be.an.instanceOf(MissingPromoInformationError);
      });
    });
  });

  describe(`Listing all Promo Enrollment Requests`, () => {
    before(async function () {
      const depositMock = await Promo.create({
        name: this.randomString(),
        template: PromoTemplate.Deposit,
        title: this.randomString(),
        description: this.randomString(),
        minimumBalance: 25,
        status: PromoStatus.Active,
      });

      const signUpMock = await Promo.create({
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

      await PromoEnrollmentRequest.create({
        member: this.member._id,
        promo: this.depositMockId,
      });

      await PromoEnrollmentRequest.create({
        member: this.member._id,
        promo: this.signUpMockId,
      });
    });

    after(async () => {
      await PromoEnrollmentRequest.deleteMany({});
      return Promo.deleteMany({});
    });

    it('should return list of all promo enrollment requests', async function () {
      this.mock = {
        id: null,
        info: null,
        source: null,
      };

      await expect(
        selectAllPromoEnrollmentRequestsUseCase(this.mock),
      ).to.eventually.fulfilled.and.have.length(2);
    });
  });

  describe(`List one Promo Enrollment Request`, () => {
    before(async function () {
      const depositMock = await Promo.create({
        name: this.randomString(),
        template: PromoTemplate.Deposit,
        title: this.randomString(),
        description: this.randomString(),
        minimumBalance: 25,
        status: PromoStatus.Active,
      });

      const signUpMock = await Promo.create({
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

      const promoEnrollmentRequestDeposit = await PromoEnrollmentRequest.create(
        {
          member: this.member._id,
          promo: this.depositMockId,
        },
      );

      const promoEnrollmentRequestSignUp = await PromoEnrollmentRequest.create({
        member: this.member._id,
        promo: this.signUpMockId,
      });

      this.promoEnrollmentRequestDepositId = promoEnrollmentRequestDeposit._id;
      this.promoEnrollmentRequestSignUpId = promoEnrollmentRequestSignUp._id;
    });

    after(async () => {
      await PromoEnrollmentRequest.deleteMany({});
      return Promo.deleteMany({});
    });

    describe('Given Existent Promo Enroll Request ID', () => {
      it('should return the promo request with the given ID', async function () {
        this.mock = {
          id: this.promoEnrollmentRequestDepositId,
          info: null,
          source: null,
        };
        await expect(
          selectOnePromoEnrollmentRequestUseCase(this.mock),
        ).to.eventually.fulfilled.property(
          '_id',
          this.promoEnrollmentRequestDepositId,
        );
      });
    });

    describe('Given Non Existent Promo Enroll Request ID', () => {
      it('should throw an error', async function () {
        const id = this.randomString();
        this.mock = {
          id,
          info: null,
          source: null,
        };
        await expect(selectOnePromoEnrollmentRequestUseCase(this.mock))
          .to.eventually.rejectedWith(
            `Promo enrollment request with ID: ${id} doesn't exists`,
          )
          .and.be.an.instanceOf(PromoEnrollmentRequestNotFoundError);
      });
    });
  });

  describe(`Updating status of enrollment request`, () => {
    before(async function () {
      const depositMock = await Promo.create({
        name: this.randomString(),
        template: PromoTemplate.Deposit,
        title: this.randomString(),
        description: this.randomString(),
        minimumBalance: 25,
        status: PromoStatus.Active,
      });

      const signUpMock = await Promo.create({
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

      const promoEnrollmentRequestDeposit = await PromoEnrollmentRequest.create(
        {
          member: this.member._id,
          promo: this.depositMockId,
        },
      );

      const promoEnrollmentRequestSignUp = await PromoEnrollmentRequest.create({
        member: this.member._id,
        promo: this.signUpMockId,
      });

      this.promoEnrollmentRequestDepositId = promoEnrollmentRequestDeposit._id;
      this.promoEnrollmentRequestSignUpId = promoEnrollmentRequestSignUp._id;
    });

    after(async () => {
      await PromoEnrollmentRequest.deleteMany({});
      return Promo.deleteMany({});
    });

    describe('Given existent promo ID and approve request use-case', () => {
      it('should return true', async function () {
        this.mock = {
          id: this.promoEnrollmentRequestDepositId,
          info: null,
          source: null,
        };
        await expect(approveEnrollmentRequestUseCase(this.mock)).to.eventually
          .fulfilled.and.be.true;
      });
    });

    describe('Given non existent promo ID and approve request use-case', () => {
      it('should return true', async function () {
        const id = this.randomString();
        this.mock = {
          id,
          info: null,
          source: null,
        };
        await expect(approveEnrollmentRequestUseCase(this.mock))
          .to.eventually.rejectedWith(
            `Promo enrollment request with ID: ${id} doesn't exists`,
          )
          .and.be.an.instanceOf(PromoEnrollmentRequestNotFoundError);
      });
    });

    describe('Given existent promo ID and reject request use-case', () => {
      it('should return true', async function () {
        this.mock = {
          id: this.promoEnrollmentRequestDepositId,
          info: null,
          source: null,
        };
        await expect(rejectEnrollmentRequestUseCase(this.mock)).to.eventually
          .fulfilled.and.be.true;
      });
    });

    describe('Given non existent promo ID and reject request use-case', () => {
      it('should return true', async function () {
        const id = this.randomString();
        this.mock = {
          id,
          info: null,
          source: null,
        };
        await expect(approveEnrollmentRequestUseCase(this.mock))
          .to.eventually.rejectedWith(
            `Promo enrollment request with ID: ${id} doesn't exists`,
          )
          .and.be.an.instanceOf(PromoEnrollmentRequestNotFoundError);
      });
    });

    describe('Given existent promo ID and reject request use-case', () => {
      it('should return true', async function () {
        this.mock = {
          id: this.promoEnrollmentRequestDepositId,
          info: null,
          source: null,
        };
        await expect(processEnrollmentRequestUseCase(this.mock)).to.eventually
          .fulfilled.and.be.true;
      });
    });

    describe('Given non existent promo ID and process request use-case', () => {
      it('should return true', async function () {
        const id = this.randomString();
        this.mock = {
          id,
          info: null,
          source: null,
        };
        await expect(approveEnrollmentRequestUseCase(this.mock))
          .to.eventually.rejectedWith(
            `Promo enrollment request with ID: ${id} doesn't exists`,
          )
          .and.be.an.instanceOf(PromoEnrollmentRequestNotFoundError);
      });
    });
  });
});

import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import mongoose from 'mongoose';

import { Chance } from 'chance';

import {
  insertPromoUseCase,
  selectOnePromoUseCase,
  selectAllPromosUseCase,
  deleteOnePromoUseCase,
  updatePromoUseCase,
} from '@use-cases/promos';

import PromoModel, {
  PromoTemplate,
  RequiredMemberFields,
  PromoStatus,
} from '@lib/mongoose/models/promo';

import { initializeDatabase, closeDatabase } from '@lib/mongoose';

import {
  MissingPromoInformationError,
  InvalidPromoTemplateError,
  InvalidPromoInformationGivenError,
  InvalidPromoRequiredMemberFieldError,
  PromoNotFoundError,
  ActivePromoError,
} from '../../../src/custom-errors';

chai.use(chaiAsPromised);

const chance = new Chance();

describe('Promo Use Cases', () => {
  before(async function () {
    this.mockedId = mongoose.Types.ObjectId().toString();
    this.mock = null;

    this.randomName = () => chance.name({ middle: true });
    this.randomTitle = () => chance.word();
    this.randomDescription = () => chance.word();
    this.randomBalance = () => chance.floating();

    await initializeDatabase();
  });

  after(async function () {
    await closeDatabase();
  });

  describe('Adding a Promo', () => {
    afterEach(() => {
      return PromoModel.deleteMany({});
    });

    beforeEach(() => {
      return PromoModel.deleteMany({});
    });

    describe('Given correct input and deposit template', () => {
      it('should return true', async function () {
        this.mock = {
          id: null,
          info: {
            name: this.randomName(),
            template: PromoTemplate.Deposit,
            title: this.randomTitle(),
            description: this.randomDescription(),
            minimumBalance: this.randomBalance(),
          },
          source: null,
        };
        await expect(insertPromoUseCase(this.mock)).to.eventually.fulfilled.and
          .be.true;
      });
    });

    describe('Given correct input and sign up template', () => {
      it('should return true', async function () {
        this.mock = {
          id: null,
          info: {
            name: this.randomName(),
            template: PromoTemplate.SignUp,
            title: this.randomTitle(),
            description: this.randomDescription(),
            requiredMemberFields: [
              RequiredMemberFields.BankAccount,
              RequiredMemberFields.Email,
              RequiredMemberFields.Realname,
            ],
          },
          source: null,
        };
        await expect(insertPromoUseCase(this.mock)).to.eventually.fulfilled.and
          .be.true;
      });
    });

    describe('Given no name', () => {
      it('should throw an error and be rejected', async function () {
        this.mock = {
          id: null,
          info: {
            name: '',
            template: PromoTemplate.Deposit,
            title: this.randomTitle(),
            description: this.randomDescription(),
            minimumBalance: this.randomBalance(),
          },
          source: null,
        };

        await expect(insertPromoUseCase(this.mock))
          .to.eventually.rejectedWith('Please input name')
          .and.be.an.instanceOf(MissingPromoInformationError);
      });
    });

    describe('Given no template', () => {
      it('should throw an error and be rejected', async function () {
        this.mock = {
          id: null,
          info: {
            name: this.randomName(),
            template: '',
            title: this.randomTitle(),
            description: this.randomDescription(),
            minimumBalance: this.randomBalance(),
          },
          source: null,
        };

        await expect(insertPromoUseCase(this.mock))
          .to.eventually.rejectedWith('Please input template')
          .and.be.an.instanceOf(MissingPromoInformationError);
      });
    });

    describe('Given invalid template', () => {
      it('should throw an error and be rejected', async function () {
        const template = this.randomTitle();
        this.mock = {
          id: null,
          info: {
            name: this.randomName(),
            template,
            title: this.randomTitle(),
            description: this.randomDescription(),
            minimumBalance: this.randomBalance(),
          },
          source: null,
        };
        await expect(insertPromoUseCase(this.mock))
          .to.eventually.rejectedWith(`Template: ${template} is invalid`)
          .and.be.an.instanceOf(InvalidPromoTemplateError);
      });
    });

    describe('Given no title', () => {
      it('should throw an error and be rejected', async function () {
        this.mock = {
          id: null,
          info: {
            name: this.randomName(),
            template: PromoTemplate.Deposit,
            title: '',
            description: this.randomDescription(),
            minimumBalance: this.randomBalance(),
          },
          source: null,
        };
        await expect(insertPromoUseCase(this.mock))
          .to.eventually.rejectedWith('Please input title')
          .and.be.an.instanceOf(MissingPromoInformationError);
      });
    });

    describe('Given no description', () => {
      it('should throw an error and be rejected', async function () {
        this.mock = {
          id: null,
          info: {
            name: this.randomName(),
            template: PromoTemplate.Deposit,
            title: this.randomTitle(),
            description: '',
            minimumBalance: this.randomBalance(),
          },
          source: null,
        };
        await expect(insertPromoUseCase(this.mock))
          .to.eventually.rejectedWith('Please input description')
          .and.be.an.instanceOf(MissingPromoInformationError);
      });
    });

    describe('Given no minimum balance and deposit template', () => {
      it('should throw an error and be rejected', async function () {
        this.mock = {
          id: null,
          info: {
            name: this.randomName(),
            template: PromoTemplate.Deposit,
            title: this.randomTitle(),
            description: this.randomDescription(),
          },
          source: null,
        };

        await expect(insertPromoUseCase(this.mock))
          .to.eventually.rejectedWith('Please input minimum balance')
          .and.be.an.instanceOf(MissingPromoInformationError);
      });
    });

    describe('Given required member fields and deposit template', () => {
      it('should throw an error and be rejected', async function () {
        this.mock = {
          id: null,
          info: {
            name: this.randomName(),
            template: PromoTemplate.Deposit,
            title: this.randomTitle(),
            description: this.randomDescription(),
            requiredMemberFields: [
              RequiredMemberFields.BankAccount,
              RequiredMemberFields.Email,
              RequiredMemberFields.Realname,
            ],
          },
          source: null,
        };

        await expect(insertPromoUseCase(this.mock))
          .to.eventually.rejectedWith(
            'Invalid input field: requiredMemberFields for deposit',
          )
          .and.be.an.instanceOf(InvalidPromoInformationGivenError);
      });
    });

    describe('Given no required member fields and sign up template', () => {
      it('should throw an error and be rejected', async function () {
        this.mock = {
          id: null,
          info: {
            name: this.randomName(),
            template: PromoTemplate.SignUp,
            title: this.randomTitle(),
            description: this.randomDescription(),
          },
          source: null,
        };

        await expect(insertPromoUseCase(this.mock))
          .to.eventually.rejectedWith('Please input required member fields')
          .and.be.an.instanceOf(MissingPromoInformationError);
      });
    });

    describe('Given erroneous required member fields and sign up template', () => {
      it('should throw an error and be rejected', async function () {
        const randomField = this.randomDescription();
        this.mock = {
          id: null,
          info: {
            name: this.randomName(),
            template: PromoTemplate.SignUp,
            title: this.randomTitle(),
            description: this.randomDescription(),
            requiredMemberFields: [randomField],
          },
          source: null,
        };

        await expect(insertPromoUseCase(this.mock))
          .to.eventually.rejectedWith(
            `Required member field: ${randomField} is invalid`,
          )
          .and.be.an.instanceOf(InvalidPromoRequiredMemberFieldError);
      });
    });

    describe('Given minimum balance and sign up template', () => {
      it('should throw an error and be rejected', async function () {
        this.mock = {
          id: null,
          info: {
            name: this.randomName(),
            template: PromoTemplate.SignUp,
            title: this.randomTitle(),
            description: this.randomDescription(),
            minimumBalance: this.randomBalance(),
          },
          source: null,
        };

        await expect(insertPromoUseCase(this.mock))
          .to.eventually.rejectedWith(
            'Invalid input field: minimumBalance for sign up',
          )
          .and.be.an.instanceOf(InvalidPromoInformationGivenError);
      });
    });
  });

  describe('Selecting All Promos', () => {
    after(() => {
      return PromoModel.deleteMany({});
    });

    before(async function () {
      await PromoModel.deleteMany({});
      this.mock = await PromoModel.create({
        name: this.randomName(),
        template: PromoTemplate.Deposit,
        title: this.randomTitle(),
        description: this.randomDescription(),
        minimumBalance: this.randomBalance(),
      });
    });

    it('should return list of promos', async function () {
      await expect(
        selectAllPromosUseCase({ id: null, info: null, source: null }),
      )
        .to.eventually.fulfilled.and.property('totalCount')
        .eqls(1);
    });
  });

  describe('Selecting One Promo', () => {
    after(() => {
      return PromoModel.deleteMany({});
    });

    before(async function () {
      await PromoModel.deleteMany({});
      this.mock = await PromoModel.create({
        name: this.randomName(),
        template: PromoTemplate.Deposit,
        title: this.randomTitle(),
        description: this.randomDescription(),
        minimumBalance: this.randomBalance(),
      });
    });

    describe('GIVEN existent filters', () => {
      it('should return the promo', async function () {
        await expect(
          selectOnePromoUseCase({
            id: this.mock._id,
            info: null,
            source: null,
          }),
        ).to.eventually.fulfilled.property('_id', this.mock._id);
      });
    });

    describe('GIVEN non existent filters', () => {
      it('should throw an error', async function () {
        await expect(
          selectOnePromoUseCase({
            id: this.mockedId,
            info: null,
            source: null,
          }),
        ).to.eventually.rejectedWith(
          `Promo with ID: ${this.mockedId} doesn't exists`,
        );
      });
    });
  });

  describe('Updating a promo', () => {
    after(() => {
      return PromoModel.deleteMany({});
    });

    before(async function () {
      await PromoModel.deleteMany({});
      const depositMock = await PromoModel.create({
        name: this.randomName(),
        template: PromoTemplate.Deposit,
        title: this.randomTitle(),
        description: this.randomDescription(),
        minimumBalance: this.randomBalance(),
      });

      const signUpMock = await PromoModel.create({
        name: this.randomName(),
        template: PromoTemplate.SignUp,
        title: this.randomTitle(),
        description: this.randomDescription(),
        requiredMemberFields: [
          RequiredMemberFields.BankAccount,
          RequiredMemberFields.Email,
          RequiredMemberFields.Realname,
        ],
      });

      this.mock = null;
      this.mock2 = depositMock._id;
      this.mock3 = signUpMock._id;
    });

    describe('Given correct inputs and deposit template', () => {
      it('should return true', async function () {
        this.mock = {
          id: this.mock3,
          info: {
            name: this.randomName(),
            template: PromoTemplate.Deposit,
            title: this.randomTitle(),
            description: this.randomDescription(),
            minimumBalance: this.randomBalance(),
            status: PromoStatus.Active,
          },
          source: null,
        };

        await expect(updatePromoUseCase(this.mock)).to.eventually.fulfilled.and
          .be.true;
      });
    });

    describe('Given correct inputs and sign up template', () => {
      it('should return true', async function () {
        this.mock = {
          id: this.mock2,
          info: {
            name: this.randomName(),
            template: PromoTemplate.SignUp,
            title: this.randomTitle(),
            description: this.randomDescription(),
            requiredMemberFields: [
              RequiredMemberFields.BankAccount,
              RequiredMemberFields.Email,
              RequiredMemberFields.Realname,
            ],
            status: PromoStatus.Active,
          },
          source: null,
        };

        await expect(updatePromoUseCase(this.mock)).to.eventually.fulfilled.and
          .be.true;
      });
    });

    describe('Given invalid status', () => {
      it('should be rejected', async function () {
        this.mock = {
          id: this.mock2,
          info: {
            name: this.randomName(),
            template: PromoTemplate.SignUp,
            title: this.randomTitle(),
            description: this.randomDescription(),
            requiredMemberFields: [
              RequiredMemberFields.BankAccount,
              RequiredMemberFields.Email,
              RequiredMemberFields.Realname,
            ],
            status: this.randomDescription(),
          },
          source: null,
        };

        await expect(updatePromoUseCase(this.mock)).to.eventually.rejected;
      });
    });

    describe('Given no name', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: this.mock2,
          info: {
            name: '',
            template: PromoTemplate.SignUp,
            title: this.randomTitle(),
            description: this.randomDescription(),
            requiredMemberFields: [
              RequiredMemberFields.BankAccount,
              RequiredMemberFields.Email,
              RequiredMemberFields.Realname,
            ],
          },
          source: null,
        };

        await expect(updatePromoUseCase(this.mock))
          .to.eventually.rejectedWith('Please input name')
          .and.be.an.instanceOf(MissingPromoInformationError);
      });
    });

    describe('Given no template', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: this.mock2,
          info: {
            name: this.randomName(),
            template: '',
            title: this.randomTitle(),
            description: this.randomDescription(),
            requiredMemberFields: [
              RequiredMemberFields.BankAccount,
              RequiredMemberFields.Email,
              RequiredMemberFields.Realname,
            ],
          },
          source: null,
        };

        await expect(updatePromoUseCase(this.mock))
          .to.eventually.rejectedWith('Please input template')
          .and.be.an.instanceOf(MissingPromoInformationError);
      });
    });

    describe('Given invalid template', () => {
      it('should throw an error', async function () {
        const template = this.randomTitle();
        this.mock = {
          id: this.mock2,
          info: {
            name: this.randomName(),
            template,
            title: this.randomTitle(),
            description: this.randomDescription(),
            requiredMemberFields: [
              RequiredMemberFields.BankAccount,
              RequiredMemberFields.Email,
              RequiredMemberFields.Realname,
            ],
          },
          source: null,
        };

        await expect(updatePromoUseCase(this.mock))
          .to.eventually.rejectedWith(`Template: ${template} is invalid`)
          .and.be.an.instanceOf(InvalidPromoTemplateError);
      });
    });

    describe('Given no title', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: this.mock2,
          info: {
            name: this.randomName(),
            template: PromoTemplate.SignUp,
            title: '',
            description: this.randomDescription(),
            requiredMemberFields: [
              RequiredMemberFields.BankAccount,
              RequiredMemberFields.Email,
              RequiredMemberFields.Realname,
            ],
          },
          source: null,
        };

        await expect(updatePromoUseCase(this.mock))
          .to.eventually.rejectedWith('Please input title')
          .and.be.an.instanceOf(MissingPromoInformationError);
      });
    });

    describe('Given no description', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: this.mock2,
          info: {
            name: this.randomName(),
            template: PromoTemplate.SignUp,
            title: this.randomTitle(),
            description: '',
            requiredMemberFields: [
              RequiredMemberFields.BankAccount,
              RequiredMemberFields.Email,
              RequiredMemberFields.Realname,
            ],
          },
          source: null,
        };

        await expect(updatePromoUseCase(this.mock))
          .to.eventually.rejectedWith('Please input description')
          .and.be.an.instanceOf(MissingPromoInformationError);
      });
    });

    describe('Given no minimum balance and deposit template', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: this.mock3,
          info: {
            name: this.randomName(),
            template: PromoTemplate.Deposit,
            title: this.randomTitle(),
            description: this.randomDescription(),
          },
          source: null,
        };

        await expect(updatePromoUseCase(this.mock))
          .to.eventually.rejectedWith('Please input minimum balance')
          .and.be.an.instanceOf(MissingPromoInformationError);
      });
    });

    describe('Given required member fields and deposit template', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: this.mock3,
          info: {
            name: this.randomName(),
            template: PromoTemplate.Deposit,
            title: this.randomTitle(),
            description: this.randomDescription(),
            requiredMemberFields: [
              RequiredMemberFields.BankAccount,
              RequiredMemberFields.Email,
              RequiredMemberFields.Realname,
            ],
          },
          source: null,
        };

        await expect(updatePromoUseCase(this.mock))
          .to.eventually.rejectedWith(
            'Invalid input field: requiredMemberFields for deposit',
          )
          .and.be.an.instanceOf(InvalidPromoInformationGivenError);
      });
    });

    describe('Given no required member fields and signup template', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: this.mock2,
          info: {
            name: this.randomName(),
            template: PromoTemplate.SignUp,
            title: this.randomTitle(),
            description: this.randomDescription(),
          },
          source: null,
        };
        await expect(updatePromoUseCase(this.mock))
          .to.eventually.rejectedWith('Please input required member fields')
          .and.be.an.instanceOf(MissingPromoInformationError);
      });
    });

    describe('Given erroneous required member fields and sign up template', () => {
      it('should return an error status code', async function () {
        const randomField = this.randomDescription();
        this.mock = {
          id: this.mock2,
          info: {
            name: this.randomName(),
            template: PromoTemplate.SignUp,
            title: this.randomTitle(),
            description: this.randomDescription(),
            requiredMemberFields: [randomField],
          },
          source: null,
        };
        await expect(updatePromoUseCase(this.mock))
          .to.eventually.rejectedWith(
            `Required member field: ${randomField} is invalid`,
          )
          .and.be.an.instanceOf(InvalidPromoRequiredMemberFieldError);
      });
    });

    describe('Given minimum balance and signup template', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: this.mock2,
          info: {
            name: this.randomName(),
            template: PromoTemplate.SignUp,
            title: this.randomTitle(),
            description: this.randomDescription(),
            minimumBalance: this.randomBalance(),
          },
          source: null,
        };
        await expect(updatePromoUseCase(this.mock))
          .to.eventually.rejectedWith(
            'Invalid input field: minimumBalance for sign up',
          )
          .and.be.an.instanceOf(InvalidPromoInformationGivenError);
      });
    });
  });

  describe('Deleting a promo', () => {
    after(() => {
      return PromoModel.deleteMany({});
    });

    before(async function () {
      await PromoModel.deleteMany({});
      const activeMock = await PromoModel.create({
        name: this.randomName(),
        template: PromoTemplate.Deposit,
        title: this.randomTitle(),
        description: this.randomDescription(),
        minimumBalance: this.randomBalance(),
        status: PromoStatus.Active,
      });

      const draftMock = await PromoModel.create({
        name: this.randomName(),
        template: PromoTemplate.SignUp,
        title: this.randomTitle(),
        description: this.randomDescription(),
        requiredMemberFields: [
          RequiredMemberFields.BankAccount,
          RequiredMemberFields.Email,
          RequiredMemberFields.Realname,
        ],
      });

      this.mock = null;
      this.activeMockId = activeMock._id;
      this.draftMockId = draftMock._id;
    });

    describe('Given existent ID', () => {
      it('should return true', async function () {
        this.mock = {
          id: this.draftMockId,
          info: null,
          source: null,
        };

        await expect(deleteOnePromoUseCase(this.mock)).to.eventually.fulfilled
          .and.be.true;
      });
    });

    describe('Given non existent ID', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: this.mockedId,
          info: null,
          source: null,
        };

        await expect(deleteOnePromoUseCase(this.mock))
          .to.eventually.rejectedWith(
            `Promo with ID: ${this.mockedId} doesn't exists`,
          )
          .and.be.an.instanceOf(PromoNotFoundError);
      });
    });

    describe('Given existent ID but is an ACTIVE promo', () => {
      it('should throw an error', async function () {
        this.mock = {
          id: this.activeMockId,
          info: null,
          source: null,
        };

        await expect(deleteOnePromoUseCase(this.mock))
          .to.eventually.rejectedWith("Active promos can't be deleted")
          .and.be.an.instanceOf(ActivePromoError);
      });
    });
  });
});

import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import mongoose from 'mongoose';

import { Chance } from 'chance';

import {
  insertPromoUseCase,
  selectOnePromoUseCase,
  selectAllPromosUseCase,
} from '../../../src/use-cases/promos';

import { Promo } from '../../../src/lib/mongoose/models/promo';

import { initializeDatabase } from '../../../src/lib/mongoose';

import { PromoTemplate, RequiredMemberFields } from '../../../src/types';

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

  describe('Adding a Promo', () => {
    afterEach(() => {
      return Promo.deleteMany({});
    });

    beforeEach(() => {
      return Promo.deleteMany({});
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

        await expect(insertPromoUseCase(this.mock)).to.eventually.rejectedWith(
          'Please input name',
        );
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

        await expect(insertPromoUseCase(this.mock)).to.eventually.rejectedWith(
          'Please input template',
        );
      });
    });

    describe('Given invalid template', () => {
      it('should throw an error and be rejected', async function () {
        this.mock = {
          id: null,
          info: {
            name: this.randomName(),
            template: this.randomTitle(),
            title: this.randomTitle(),
            description: this.randomDescription(),
            minimumBalance: this.randomBalance(),
          },
          source: null,
        };
        await expect(insertPromoUseCase(this.mock)).to.eventually.rejectedWith(
          'Invalid template',
        );
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
        await expect(insertPromoUseCase(this.mock)).to.eventually.rejectedWith(
          'Please input title',
        );
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
        await expect(insertPromoUseCase(this.mock)).to.eventually.rejectedWith(
          'Please input description',
        );
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

        await expect(insertPromoUseCase(this.mock)).to.eventually.rejectedWith(
          'Please input minimum balance',
        );
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

        await expect(insertPromoUseCase(this.mock)).to.eventually.rejectedWith(
          'Invalid input field: requiredMemberFields for deposit',
        );
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

        await expect(insertPromoUseCase(this.mock)).to.eventually.rejectedWith(
          'Please input required member fields',
        );
      });
    });

    describe('Given erroneous required member fields and sign up template', () => {
      it('should throw an error and be rejected', async function () {
        this.mock = {
          id: null,
          info: {
            name: this.randomName(),
            template: PromoTemplate.SignUp,
            title: this.randomTitle(),
            description: this.randomDescription(),
            requiredMemberFields: [this.randomDescription()],
          },
          source: null,
        };

        await expect(insertPromoUseCase(this.mock)).to.eventually.rejectedWith(
          'Invalid member field',
        );
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

        await expect(insertPromoUseCase(this.mock)).to.eventually.rejectedWith(
          'Invalid input field: minimumBalance for sign up',
        );
      });
    });
  });

  describe('Selecting All Promos', () => {
    after(() => {
      return Promo.deleteMany({});
    });

    before(async function () {
      await Promo.deleteMany({});
      this.mock = await Promo.create({
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
      ).to.eventually.fulfilled.and.length(1);
    });
  });

  describe('Selecting One Promo', () => {
    after(() => {
      return Promo.deleteMany({});
    });

    before(async function () {
      await Promo.deleteMany({});
      this.mock = await Promo.create({
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
        ).to.eventually.rejectedWith('Promo not found');
      });
    });
  });
});

import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import { Chance } from 'chance';

import { promoEntity } from '../../src/entities/promo';

import { PromoTemplate, RequiredMemberFields } from '../../src/types';

import {
  MissingPromoInformationError,
  InvalidPromoTemplateError,
  InvalidPromoInformationGivenError,
  InvalidPromoRequiredMemberFieldError,
} from '../../src/custom-errors';

const chance = new Chance();

chai.use(chaiAsPromised);

describe('Promo Entity', () => {
  before(function () {
    this.randomName = () => chance.name({ middle: true });
    this.randomTitle = () => chance.word();
    this.randomDescription = () => chance.word();
    this.randomBalance = () => chance.floating();
    this.mock = null;
  });

  describe('Given correct input and deposit template', () => {
    it('should be fulfilled', async function () {
      this.mock = {
        name: this.randomName(),
        template: PromoTemplate.Deposit,
        title: this.randomTitle(),
        description: this.randomDescription(),
        minimumBalance: this.randomBalance(),
      };
      await expect(promoEntity(this.mock)).to.eventually.fulfilled;
    });
  });

  describe('Given correct input and sign up template', () => {
    it('should be fulfilled', async function () {
      this.mock = {
        name: this.randomName(),
        template: PromoTemplate.SignUp,
        title: this.randomTitle(),
        description: this.randomDescription(),
        requiredMemberFields: [
          RequiredMemberFields.BankAccount,
          RequiredMemberFields.Email,
          RequiredMemberFields.Realname,
        ],
      };
      await expect(promoEntity(this.mock)).to.eventually.fulfilled;
    });
  });

  describe('Given no name', () => {
    it('should throw an error and be rejected', async function () {
      this.mock = {
        name: '',
        template: PromoTemplate.Deposit,
        title: this.randomTitle(),
        description: this.randomDescription(),
        minimumBalance: this.randomBalance(),
      };
      await expect(promoEntity(this.mock))
        .to.eventually.rejectedWith('Please input name')
        .and.be.an.instanceOf(MissingPromoInformationError);
    });
  });

  describe('Given no template', () => {
    it('should throw an error and be rejected', async function () {
      this.mock = {
        name: this.randomName(),
        template: '',
        title: this.randomTitle(),
        description: this.randomDescription(),
        minimumBalance: this.randomBalance(),
      };
      await expect(promoEntity(this.mock))
        .to.eventually.rejectedWith('Please input template')
        .and.be.an.instanceOf(MissingPromoInformationError);
    });
  });

  describe('Given invalid template', () => {
    it('should throw an error and be rejected', async function () {
      this.mock = {
        name: this.randomName(),
        template: this.randomTitle(),
        title: this.randomTitle(),
        description: this.randomDescription(),
        minimumBalance: this.randomBalance(),
      };
      await expect(promoEntity(this.mock))
        .to.eventually.rejectedWith(
          `Template: ${this.mock.template} is invalid`,
        )
        .and.be.an.instanceOf(InvalidPromoTemplateError);
    });
  });

  describe('Given no title', () => {
    it('should throw an error and be rejected', async function () {
      this.mock = {
        name: this.randomName(),
        template: PromoTemplate.Deposit,
        title: '',
        description: this.randomDescription(),
        minimumBalance: this.randomBalance(),
      };
      await expect(promoEntity(this.mock))
        .to.eventually.rejectedWith('Please input title')
        .and.be.an.instanceOf(MissingPromoInformationError);
    });
  });

  describe('Given no description', () => {
    it('should throw an error and be rejected', async function () {
      this.mock = {
        name: this.randomName(),
        template: PromoTemplate.Deposit,
        title: this.randomTitle(),
        description: '',
        minimumBalance: this.randomBalance(),
      };
      await expect(promoEntity(this.mock))
        .to.eventually.rejectedWith('Please input description')
        .and.be.an.instanceOf(MissingPromoInformationError);
    });
  });

  describe('Given no minimum balance and deposit template', () => {
    it('should throw an error and be rejected', async function () {
      this.mock = {
        name: this.randomName(),
        template: PromoTemplate.Deposit,
        title: this.randomTitle(),
        description: this.randomDescription(),
      };
      await expect(promoEntity(this.mock))
        .to.eventually.rejectedWith('Please input minimum balance')
        .and.be.an.instanceOf(MissingPromoInformationError);
    });
  });

  describe('Given required member fields and deposit template', () => {
    it('should throw an error and be rejected', async function () {
      this.mock = {
        name: this.randomName(),
        template: PromoTemplate.Deposit,
        title: this.randomTitle(),
        description: this.randomDescription(),
        requiredMemberFields: [
          RequiredMemberFields.BankAccount,
          RequiredMemberFields.Email,
          RequiredMemberFields.Realname,
        ],
      };
      await expect(promoEntity(this.mock))
        .to.eventually.rejectedWith(
          'Invalid input field: requiredMemberFields for deposit',
        )
        .and.be.an.instanceOf(InvalidPromoInformationGivenError);
    });
  });

  describe('Given no required member fields and sign up template', () => {
    it('should throw an error and be rejected', async function () {
      this.mock = {
        name: this.randomName(),
        template: PromoTemplate.SignUp,
        title: this.randomTitle(),
        description: this.randomDescription(),
      };
      await expect(promoEntity(this.mock))
        .to.eventually.rejectedWith('Please input required member fields')
        .and.be.an.instanceOf(MissingPromoInformationError);
    });
  });

  describe('Given erroneous required member fields and sign up template', () => {
    it('should throw an error and be rejected', async function () {
      this.mock = {
        name: this.randomName(),
        template: PromoTemplate.SignUp,
        title: this.randomTitle(),
        description: this.randomDescription(),
        requiredMemberFields: [this.randomDescription()],
      };
      await expect(promoEntity(this.mock))
        .to.eventually.rejectedWith(
          `Required member field: ${this.mock.requiredMemberFields} is invalid`,
        )
        .and.be.an.instanceOf(InvalidPromoRequiredMemberFieldError);
    });
  });

  describe('Given minimum balance and sign up template', () => {
    it('should throw an error and be rejected', async function () {
      this.mock = {
        name: this.randomName(),
        template: PromoTemplate.SignUp,
        title: this.randomTitle(),
        description: this.randomDescription(),
        minimumBalance: this.randomBalance(),
      };
      await expect(promoEntity(this.mock))
        .to.eventually.rejectedWith(
          'Invalid input field: minimumBalance for sign up',
        )
        .and.be.an.instanceOf(InvalidPromoInformationGivenError);
    });
  });
});

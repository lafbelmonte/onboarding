import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import mongoose from 'mongoose';

import { Chance } from 'chance';
import { initializeDatabase, closeDatabase } from '../../../src/lib/mongoose';

import PromoModel, {
  PromoTemplate,
  RequiredMemberFields,
  PromoStatus,
} from '../../../src/lib/mongoose/models/promo';

chai.use(chaiAsPromised);

const chance = new Chance();

describe('Promo Models', () => {
  before(async function () {
    this.randomName = () => chance.name({ middle: true });
    this.randomTitle = () => chance.word();
    this.randomDescription = () => chance.word();
    this.randomBalance = () => chance.floating();
    this.mock = null;
    this.mockedId = mongoose.Types.ObjectId().toString();
    await initializeDatabase();
  });

  after(async function () {
    await closeDatabase();
  });

  describe('Creating a promo', () => {
    afterEach(() => {
      return PromoModel.deleteMany({});
    });

    beforeEach(() => {
      return PromoModel.deleteMany({});
    });

    describe('Given correct inputs and deposit template', () => {
      it('should be fulfilled and have status of DRAFT', async function () {
        this.mock = {
          name: this.randomName(),
          template: PromoTemplate.Deposit,
          title: this.randomTitle(),
          description: this.randomDescription(),
          minimumBalance: this.randomBalance(),
        };
        await expect(
          PromoModel.create(this.mock),
        ).to.eventually.fulfilled.property('status', PromoStatus.Draft);
      });
    });

    describe('Given correct input and sign up template', () => {
      it('should be fulfilled and have status of DRAFT', async function () {
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
        await expect(
          PromoModel.create(this.mock),
        ).to.eventually.fulfilled.property('status', PromoStatus.Draft);
      });
    });

    describe('Given no name', () => {
      it('should be rejected', async function () {
        this.mock = {
          name: '',
          template: PromoTemplate.Deposit,
          title: this.randomTitle(),
          description: this.randomDescription(),
          minimumBalance: this.randomBalance(),
        };
        await expect(PromoModel.create(this.mock)).to.eventually.rejected;
      });
    });

    describe('Given no title', () => {
      it('should be rejected', async function () {
        this.mock = {
          name: this.randomName(),
          template: PromoTemplate.Deposit,
          title: '',
          description: this.randomDescription(),
          minimumBalance: this.randomBalance(),
        };
        await expect(PromoModel.create(this.mock)).to.eventually.rejected;
      });
    });

    describe('Given no description', () => {
      it('should be rejected', async function () {
        this.mock = {
          name: this.randomName(),
          template: PromoTemplate.Deposit,
          title: this.randomTitle(),
          description: '',
          minimumBalance: this.randomBalance(),
        };
        await expect(PromoModel.create(this.mock)).to.eventually.rejected;
      });
    });

    describe('Given erroneous required fields member and sign up template', () => {
      it('should be rejected', async function () {
        this.mock = {
          name: this.randomName(),
          template: PromoTemplate.SignUp,
          title: this.randomTitle(),
          description: this.randomDescription(),
          requiredMemberFields: [this.randomDescription()],
        };
        await expect(PromoModel.create(this.mock)).to.eventually.rejected;
      });
    });
  });

  describe('Updating a Promo', () => {
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

      this.baseId = this.mock._id;
    });

    describe('GIVEN correct inputs and deposit template', () => {
      it('should be fulfilled', async function () {
        this.mock = {
          name: this.randomName(),
          template: PromoTemplate.Deposit,
          title: this.randomTitle(),
          description: this.randomDescription(),
          minimumBalance: this.randomBalance(),
          status: PromoStatus.Active,
        };

        await expect(
          PromoModel.findOneAndUpdate({ _id: this.baseId }, this.mock, {
            new: true,
          }),
        ).to.eventually.fulfilled;
      });
    });

    describe('GIVEN correct inputs and signup template', () => {
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
          status: PromoStatus.Active,
        };
        await expect(
          PromoModel.findOneAndUpdate({ _id: this.baseId }, this.mock, {
            new: true,
          }),
        ).to.eventually.fulfilled;
      });
    });

    describe('GIVEN invalid status', () => {
      it('should be rejected', async function () {
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
          status: this.randomName(),
        };

        await expect(
          PromoModel.findOneAndUpdate({ _id: this.baseId }, this.mock, {
            new: true,
          }),
        ).to.eventually.rejected;
      });
    });

    describe('GIVEN no name', () => {
      it('should be rejected', async function () {
        this.mock = {
          name: '',
          template: PromoTemplate.SignUp,
          title: this.randomTitle(),
          description: this.randomDescription(),
          requiredMemberFields: [
            RequiredMemberFields.BankAccount,
            RequiredMemberFields.Email,
            RequiredMemberFields.Realname,
          ],
        };

        await expect(
          PromoModel.findOneAndUpdate({ _id: this.baseId }, this.mock, {
            new: true,
          }),
        ).to.eventually.rejected;
      });
    });

    describe('GIVEN no template', () => {
      it('should be rejected', async function () {
        this.mock = {
          name: this.randomName(),
          template: '',
          title: this.randomTitle(),
          description: this.randomDescription(),
          requiredMemberFields: [
            RequiredMemberFields.BankAccount,
            RequiredMemberFields.Email,
            RequiredMemberFields.Realname,
          ],
        };

        await expect(
          PromoModel.findOneAndUpdate({ _id: this.baseId }, this.mock, {
            new: true,
          }),
        ).to.eventually.rejected;
      });
    });

    describe('GIVEN invalid template', () => {
      it('should be rejected', async function () {
        this.mock = {
          name: this.randomName(),
          template: this.randomName(),
          title: this.randomTitle(),
          description: this.randomDescription(),
          requiredMemberFields: [
            RequiredMemberFields.BankAccount,
            RequiredMemberFields.Email,
            RequiredMemberFields.Realname,
          ],
        };

        await expect(
          PromoModel.findOneAndUpdate({ _id: this.baseId }, this.mock, {
            new: true,
          }),
        ).to.eventually.rejected;
      });
    });

    describe('GIVEN no title', () => {
      it('should be rejected', async function () {
        this.mock = {
          name: this.randomName(),
          template: PromoTemplate.SignUp,
          title: '',
          description: this.randomDescription(),
          requiredMemberFields: [
            RequiredMemberFields.BankAccount,
            RequiredMemberFields.Email,
            RequiredMemberFields.Realname,
          ],
        };

        await expect(
          PromoModel.findOneAndUpdate({ _id: this.baseId }, this.mock, {
            new: true,
          }),
        ).to.eventually.rejected;
      });
    });

    describe('GIVEN no description', () => {
      it('should be rejected', async function () {
        this.mock = {
          name: this.randomName(),
          template: PromoTemplate.SignUp,
          title: this.randomTitle(),
          description: '',
          requiredMemberFields: [
            RequiredMemberFields.BankAccount,
            RequiredMemberFields.Email,
            RequiredMemberFields.Realname,
          ],
        };

        await expect(
          PromoModel.findOneAndUpdate({ _id: this.baseId }, this.mock, {
            new: true,
          }),
        ).to.eventually.rejected;
      });
    });

    describe('GIVEN invalid required member fields', () => {
      it('should be rejected', async function () {
        this.mock = {
          name: this.randomName(),
          template: PromoTemplate.SignUp,
          title: this.randomTitle(),
          description: this.randomDescription(),
          requiredMemberFields: [this.randomTitle()],
        };

        await expect(
          PromoModel.findOneAndUpdate({ _id: this.baseId }, this.mock, {
            new: true,
          }),
        ).to.eventually.rejected;
      });
    });
  });

  describe('Deleting a promo', () => {
    after(() => {
      return PromoModel.deleteMany({});
    });

    before(async function () {
      await PromoModel.deleteMany({});
    });

    describe('GIVEN valid and existent promo ID', () => {
      it('should be fulfilled and deleted count should be 1', async function () {
        this.mock = await PromoModel.create({
          name: this.randomName(),
          template: PromoTemplate.Deposit,
          title: this.randomTitle(),
          description: this.randomDescription(),
          minimumBalance: this.randomBalance(),
        });

        await expect(
          PromoModel.deleteOne({ _id: this.mock._id }),
        ).to.eventually.fulfilled.property('deletedCount', 1);
      });
    });

    describe('GIVEN non existent promo ID', () => {
      it('should be fulfilled and deleted count should be 0', async function () {
        await expect(
          PromoModel.deleteOne({ _id: this.mockedId }),
        ).to.eventually.fulfilled.property('deletedCount', 0);
      });
    });
  });
});

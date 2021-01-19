import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcrypt';
import { Chance } from 'chance';

import mongoose from 'mongoose';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import server from '../../../src/index';

import { Member } from '../../../src/lib/mongoose/models/member';
import { Promo } from '../../../src/lib/mongoose/models/promo';
import { PromoEnrollmentRequest } from '../../../src/lib/mongoose/models/promo-enrollment-request';

import {
  PromoTemplate,
  PromoStatus,
  RequiredMemberFields,
} from '../../../src/types';

chai.use(chaiHttp);

const chance = new Chance();

describe('Promo Enrollment Queries', function () {
  before(async function () {
    this.mockedId = mongoose.Types.ObjectId().toString();
    this.mock = null;
    this.request = () => chai.request(server.callback());

    this.randomString = () => chance.word();

    const username = this.randomString();
    const password = this.randomString();

    const member = await Member.create({
      username,
      password: await bcrypt.hash(password, 10),
      realName: this.randomString(),
      email: this.randomString(),
      bankAccount: this.randomString(),
      balance: 26,
    });

    const account = await this.request().post(`/auth`).send({
      username,
      password,
    });
    this.loggedInMember = member;
    this.token = account.body.token;
  });

  after(() => {
    return Member.deleteMany({});
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

    describe('GIVEN no token', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            enrollToPromo: {
              __args: {
                promo: this.depositMockId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls('Forbidden');
      });
    });

    describe('Given erroneous token', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            enrollToPromo: {
              __args: {
                promo: this.depositMockId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.randomString()}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls('Forbidden');
      });
    });

    describe('Given valid member to enroll to a deposit promo', () => {
      it('should return true', async function () {
        this.mock = {
          mutation: {
            enrollToPromo: {
              __args: {
                promo: this.depositMockId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data).property('enrollToPromo', true);
      });
    });

    describe('Given valid member to enroll to a sign up promo', () => {
      it('should return true', async function () {
        this.mock = {
          mutation: {
            enrollToPromo: {
              __args: {
                promo: this.signUpMockId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data).property('enrollToPromo', true);
      });
    });

    describe('Given empty promo field', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            enrollToPromo: {
              __args: {
                promo: '',
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls('Please input promo ID');
      });
    });

    describe('Given no promo field', () => {
      it('should return an error status code', async function () {
        this.mock = {
          mutation: {
            enrollToPromo: {
              __args: {},
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(400);
      });
    });

    describe('Given non existent promo', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            enrollToPromo: {
              __args: {
                promo: `${this.randomString()}`,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls('Promo not found');
      });
    });

    describe('Given enrolled already promo', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            enrollToPromo: {
              __args: {
                promo: this.depositMockId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls(
          'You are already enrolled in this promo',
        );
      });
    });

    describe('Given member with not enough balance to enroll to a deposit promo', () => {
      it('should throw an error', async function () {
        await Member.findOneAndUpdate(
          { _id: this.loggedInMember._id },
          { balance: 24 },
        );

        this.mock = {
          mutation: {
            enrollToPromo: {
              __args: {
                promo: this.depositMockId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls(
          `You don't have enough balance to enroll in this promo`,
        );
      });
    });

    describe('Given member with no email to enroll to a sign up promo', () => {
      it('should throw an error', async function () {
        await Member.findOneAndUpdate(
          { _id: this.loggedInMember._id },
          {
            realName: this.randomString(),
            email: null,
            bankAccount: this.randomString(),
          },
        );

        this.mock = {
          mutation: {
            enrollToPromo: {
              __args: {
                promo: this.signUpMockId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls(
          `Required member field EMAIL is missing`,
        );
      });
    });

    describe('Given member with no real name to enroll to a sign up promo', () => {
      it('should throw an error', async function () {
        await Member.findOneAndUpdate(
          { _id: this.loggedInMember._id },
          {
            realName: null,
            email: this.randomString(),
            bankAccount: this.randomString(),
          },
        );

        this.mock = {
          mutation: {
            enrollToPromo: {
              __args: {
                promo: this.signUpMockId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls(
          `Required member field REAL_NAME is missing`,
        );
      });
    });

    describe('Given member with no bank account to enroll to a sign up promo', () => {
      it('should throw an error', async function () {
        await Member.findOneAndUpdate(
          { _id: this.loggedInMember._id },
          {
            realName: this.randomString(),
            email: this.randomString(),
            bankAccount: null,
          },
        );

        this.mock = {
          mutation: {
            enrollToPromo: {
              __args: {
                promo: this.signUpMockId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls(
          `Required member field BANK_ACCOUNT is missing`,
        );
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
          mutation: {
            enrollToPromo: {
              __args: {
                promo: this.signUpMockId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls(`Promo is not active`);
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
          mutation: {
            enrollToPromo: {
              __args: {
                promo: this.signUpMockId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls(`Promo is not active`);
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
          mutation: {
            enrollToPromo: {
              __args: {
                promo: this.depositMockId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls(
          `Minimum balance not set in the promo`,
        );
      });
    });
  });
});

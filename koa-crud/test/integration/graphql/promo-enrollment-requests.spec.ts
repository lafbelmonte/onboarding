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
import { initializeDatabase, closeDatabase } from '../../../src/lib/mongoose';
import {
  PromoTemplate,
  PromoStatus,
  RequiredMemberFields,
} from '../../../src/types';

chai.use(chaiHttp);

const chance = new Chance();

describe('Promo Enrollment Queries', function () {
  before(async function () {
    await initializeDatabase();
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
        expect(main.body.errors[0].extensions.code).eqls('NOT_ALLOWED_ERROR');
        expect(main.body.errors[0].message).eqls(
          'You are not allowed to access this resource',
        );
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
        expect(main.body.errors[0].extensions.code).eqls('NOT_ALLOWED_ERROR');
        expect(main.body.errors[0].message).eqls(
          'You are not allowed to access this resource',
        );
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
        expect(main.body.errors[0].extensions.code).eqls(
          'MISSING_PROMO_ENROLLMENT_REQUEST_INFORMATION_ERROR',
        );
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
        expect(main.body.errors[0].extensions.code).eqls(
          'GRAPHQL_PARSE_FAILED',
        );
      });
    });

    describe('Given non existent promo', () => {
      it('should throw an error', async function () {
        const promo = this.randomString();

        this.mock = {
          mutation: {
            enrollToPromo: {
              __args: {
                promo,
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
        expect(main.body.errors[0].extensions.code).eqls('PROMO_NOT_FOUND');
        expect(main.body.errors[0].message).eqls(
          `Promo with ID: ${promo} doesn't exists`,
        );
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
        expect(main.body.errors[0].extensions.code).eqls('EXISTING_ENROLLMENT');
        expect(main.body.errors[0].message).eqls(
          'Member is already enrolled in this promo',
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
        expect(main.body.errors[0].extensions.code).eqls('NOT_ENOUGH_BALANCE');
        expect(main.body.errors[0].message).eqls(
          `Member doesn't have enough balance to enroll in this promo`,
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
        expect(main.body.errors[0].extensions.code).eqls(
          'REQUIRED_MEMBER_FIELDS_NOT_MET',
        );
        expect(main.body.errors[0].message).eqls(
          `Required member field EMAIL is missing from member`,
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
        expect(main.body.errors[0].extensions.code).eqls(
          'REQUIRED_MEMBER_FIELDS_NOT_MET',
        );
        expect(main.body.errors[0].message).eqls(
          `Required member field REAL_NAME is missing from member`,
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
        expect(main.body.errors[0].extensions.code).eqls(
          'REQUIRED_MEMBER_FIELDS_NOT_MET',
        );
        expect(main.body.errors[0].message).eqls(
          `Required member field BANK_ACCOUNT is missing from member`,
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
        expect(main.body.errors[0].extensions.code).eqls('INVALID_PROMO');
        expect(main.body.errors[0].message).eqls(
          `Promo with ID: ${this.signUpMockId} not active`,
        );
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
        expect(main.body.errors[0].extensions.code).eqls('INVALID_PROMO');
        expect(main.body.errors[0].message).eqls(
          `Promo with ID: ${this.signUpMockId} not active`,
        );
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
        expect(main.body.errors[0].extensions.code).eqls(
          'MISSING_PROMO_INFORMATION',
        );
        expect(main.body.errors[0].message).eqls(
          `Minimum balance not set in the promo`,
        );
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

      const start = await PromoEnrollmentRequest.create({
        member: this.loggedInMember._id,
        promo: this.depositMockId,
      });

      await PromoEnrollmentRequest.create({
        member: this.loggedInMember._id,
        promo: this.signUpMockId,
      });

      this.startBuffer = start.cursor.toString('base64');
    });

    after(async () => {
      await PromoEnrollmentRequest.deleteMany({});
      return Promo.deleteMany({});
    });

    it('should return list of all promo enrollment requests', async function () {
      this.mock = {
        query: {
          promoEnrollmentRequests: {
            __args: {
              first: 2,
              after: this.startBuffer,
            },
            totalCount: true,
            edges: {
              node: {
                member: {
                  id: true,
                  username: true,
                  realName: true,
                  email: true,
                  bankAccount: true,
                  balance: true,
                },
                promo: {
                  id: true,
                  name: true,
                  status: true,
                  template: true,
                  title: true,
                  createdAt: true,
                  updatedAt: true,
                  __on: [
                    {
                      __typeName: 'DepositPromo',
                      minimumBalance: true,
                    },
                    {
                      __typeName: 'SignUpPromo',
                      requiredMemberFields: true,
                    },
                  ],
                  submitted: true,
                  enabled: true,
                },
              },
              cursor: true,
            },
            pageInfo: {
              hasNextPage: true,
              endCursor: true,
            },
          },
        },
      };

      const query = jsonToGraphQLQuery(this.mock);
      const main = await this.request().post('/graphql').send({ query });
      expect(main.statusCode).to.eqls(200);
      expect(main.body.data.promoEnrollmentRequests.totalCount).eqls(2);
      expect(main.body.data.promoEnrollmentRequests.edges).have.length(2);
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
          member: this.loggedInMember._id,
          promo: this.depositMockId,
        },
      );

      const promoEnrollmentRequestSignUp = await PromoEnrollmentRequest.create({
        member: this.loggedInMember._id,
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
          query: {
            promoEnrollmentRequest: {
              __args: {
                id: this.promoEnrollmentRequestDepositId,
              },
              id: true,
              member: {
                id: true,
                username: true,
                realName: true,
                email: true,
                bankAccount: true,
                balance: true,
              },
              promo: {
                id: true,
                name: true,
                status: true,
                template: true,
                title: true,
                createdAt: true,
                updatedAt: true,
                __on: [
                  {
                    __typeName: 'DepositPromo',
                    minimumBalance: true,
                  },
                  {
                    __typeName: 'SignUpPromo',
                    requiredMemberFields: true,
                  },
                ],
                submitted: true,
                enabled: true,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data.promoEnrollmentRequest.id).to.eqls(
          this.promoEnrollmentRequestDepositId,
        );
      });
    });

    describe('Given Non Existent Promo Enroll Request ID', () => {
      it('should throw an error', async function () {
        const promoEnrollmentRequestId = this.randomString();
        this.mock = {
          query: {
            promoEnrollmentRequest: {
              __args: {
                id: promoEnrollmentRequestId,
              },
              id: true,
              member: {
                id: true,
                username: true,
                realName: true,
                email: true,
                bankAccount: true,
                balance: true,
              },
              promo: {
                id: true,
                name: true,
                status: true,
                template: true,
                title: true,
                createdAt: true,
                updatedAt: true,
                __on: [
                  {
                    __typeName: 'DepositPromo',
                    minimumBalance: true,
                  },
                  {
                    __typeName: 'SignUpPromo',
                    requiredMemberFields: true,
                  },
                ],
                submitted: true,
                enabled: true,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'PROMO_ENROLLMENT_REQUEST_NOT_FOUND',
        );
        expect(main.body.errors[0].message).eqls(
          `Promo enrollment request with ID: ${promoEnrollmentRequestId} doesn't exists`,
        );
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
          member: this.loggedInMember._id,
          promo: this.depositMockId,
        },
      );

      const promoEnrollmentRequestSignUp = await PromoEnrollmentRequest.create({
        member: this.loggedInMember._id,
        promo: this.signUpMockId,
      });

      this.promoEnrollmentRequestDepositId = promoEnrollmentRequestDeposit._id;
      this.promoEnrollmentRequestSignUpId = promoEnrollmentRequestSignUp._id;
    });

    after(async () => {
      await PromoEnrollmentRequest.deleteMany({});
      return Promo.deleteMany({});
    });

    describe('Given existent promo ID and approve request mutation', () => {
      it('should return true', async function () {
        this.mock = {
          mutation: {
            approvePromoEnrollmentRequest: {
              __args: {
                id: this.promoEnrollmentRequestDepositId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data).property('approvePromoEnrollmentRequest', true);
      });
    });

    describe('Given non existent promo ID and approve request mutation', () => {
      it('should throw an error', async function () {
        const promoEnrollmentRequestId = this.randomString();

        this.mock = {
          mutation: {
            approvePromoEnrollmentRequest: {
              __args: {
                id: promoEnrollmentRequestId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'PROMO_ENROLLMENT_REQUEST_NOT_FOUND',
        );
        expect(main.body.errors[0].message).eqls(
          `Promo enrollment request with ID: ${promoEnrollmentRequestId} doesn't exists`,
        );
      });
    });

    describe('Given no ID field and approve request mutation', () => {
      it('throw an error status code', async function () {
        this.mock = {
          mutation: {
            approvePromoEnrollmentRequest: {
              __args: {},
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(400);
        expect(main.body.errors[0].extensions.code).eqls(
          'GRAPHQL_PARSE_FAILED',
        );
      });
    });

    describe('Given existent promo ID and reject request mutation', () => {
      it('should return true', async function () {
        this.mock = {
          mutation: {
            rejectPromoEnrollmentRequest: {
              __args: {
                id: this.promoEnrollmentRequestDepositId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data).property('rejectPromoEnrollmentRequest', true);
      });
    });

    describe('Given non existent promo ID and reject request mutation', () => {
      it('should throw an error', async function () {
        const promoEnrollmentRequestId = this.randomString();

        this.mock = {
          mutation: {
            rejectPromoEnrollmentRequest: {
              __args: {
                id: promoEnrollmentRequestId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'PROMO_ENROLLMENT_REQUEST_NOT_FOUND',
        );
        expect(main.body.errors[0].message).eqls(
          `Promo enrollment request with ID: ${promoEnrollmentRequestId} doesn't exists`,
        );
      });
    });

    describe('Given no ID field and reject request mutation', () => {
      it('should return an error status code', async function () {
        this.mock = {
          mutation: {
            rejectPromoEnrollmentRequest: {
              __args: {},
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(400);
        expect(main.body.errors[0].extensions.code).eqls(
          'GRAPHQL_PARSE_FAILED',
        );
      });
    });

    describe('Given existent promo ID and process request mutation', () => {
      it('should return true', async function () {
        this.mock = {
          mutation: {
            processPromoEnrollmentRequest: {
              __args: {
                id: this.promoEnrollmentRequestDepositId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data).property('processPromoEnrollmentRequest', true);
      });
    });

    describe('Given non existent promo ID and process request mutation', () => {
      it('should throw an error', async function () {
        const promoEnrollmentRequestId = this.randomString();
        this.mock = {
          mutation: {
            processPromoEnrollmentRequest: {
              __args: {
                id: promoEnrollmentRequestId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'PROMO_ENROLLMENT_REQUEST_NOT_FOUND',
        );
        expect(main.body.errors[0].message).eqls(
          `Promo enrollment request with ID: ${promoEnrollmentRequestId} doesn't exists`,
        );
      });
    });

    describe('Given no ID field and process request mutation', () => {
      it('should return an error status code', async function () {
        this.mock = {
          mutation: {
            processPromoEnrollmentRequest: {
              __args: {},
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(400);
        expect(main.body.errors[0].extensions.code).eqls(
          'GRAPHQL_PARSE_FAILED',
        );
      });
    });
  });
});

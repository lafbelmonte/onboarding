import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import mongoose from 'mongoose';
import { Chance } from 'chance';
import { jsonToGraphQLQuery, EnumType } from 'json-to-graphql-query';
import server from '@server';

import { initializeDatabase, closeDatabase } from '@lib/mongoose';

import PromoModel, {
  PromoTemplate,
  RequiredMemberFields,
  PromoStatus,
} from '@lib/mongoose/models/promo';

chai.use(chaiHttp);

const chance = new Chance();

describe('Promo Queries', function () {
  before(async function () {
    await initializeDatabase();
    this.mockedId = mongoose.Types.ObjectId().toString();

    this.randomName = () => chance.name({ middle: true });
    this.randomTitle = () => chance.word();
    this.randomDescription = () => chance.word();
    this.randomBalance = () => chance.floating();

    this.mock = null;
    this.request = () => chai.request(server.callback());
  });

  after(async function () {
    await closeDatabase();
  });

  describe('Promo Creation', () => {
    afterEach(() => {
      return PromoModel.deleteMany({});
    });

    beforeEach(() => {
      return PromoModel.deleteMany({});
    });

    describe('Given correct inputs and deposit template', () => {
      it('should return true', async function () {
        this.mock = {
          mutation: {
            createPromo: {
              __args: {
                input: {
                  name: this.randomName(),
                  template: new EnumType(PromoTemplate.Deposit),
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                  minimumBalance: this.randomBalance(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data).property('createPromo', true);
      });
    });

    describe('Given correct inputs and sign up template', () => {
      it('should return true', async function () {
        this.mock = {
          mutation: {
            createPromo: {
              __args: {
                input: {
                  name: this.randomName(),
                  template: new EnumType(PromoTemplate.SignUp),
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                  requiredMemberFields: [
                    new EnumType(RequiredMemberFields.BankAccount),
                    new EnumType(RequiredMemberFields.Email),
                    new EnumType(RequiredMemberFields.Realname),
                  ],
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data).property('createPromo', true);
      });
    });

    describe('Given no name', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            createPromo: {
              __args: {
                input: {
                  name: '',
                  template: new EnumType(PromoTemplate.SignUp),
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                  requiredMemberFields: [
                    new EnumType(RequiredMemberFields.BankAccount),
                    new EnumType(RequiredMemberFields.Email),
                    new EnumType(RequiredMemberFields.Realname),
                  ],
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'MISSING_PROMO_INFORMATION',
        );
        expect(main.body.errors[0].message).eqls('Please input name');
      });
    });

    describe('Given no template', () => {
      it('should return with error status code', async function () {
        this.mock = {
          mutation: {
            createPromo: {
              __args: {
                input: {
                  name: this.randomName(),
                  template: '',
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                  minimumBalance: this.randomBalance(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(400);
        expect(main.body.errors[0].extensions.code).eqls(
          'GRAPHQL_VALIDATION_FAILED',
        );
      });
    });

    describe('Given invalid template', () => {
      it('should return with error status code', async function () {
        this.mock = {
          mutation: {
            createPromo: {
              __args: {
                input: {
                  name: this.randomName(),
                  template: this.randomTitle(),
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                  minimumBalance: this.randomBalance(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(400);
        expect(main.body.errors[0].extensions.code).eqls(
          'GRAPHQL_VALIDATION_FAILED',
        );
      });
    });

    describe('Given no title', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            createPromo: {
              __args: {
                input: {
                  name: this.randomName(),
                  template: new EnumType(PromoTemplate.Deposit),
                  title: '',
                  description: this.randomDescription(),
                  minimumBalance: this.randomBalance(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'MISSING_PROMO_INFORMATION',
        );
        expect(main.body.errors[0].message).eqls('Please input title');
      });
    });

    describe('Given no description', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            createPromo: {
              __args: {
                input: {
                  name: this.randomName(),
                  template: new EnumType(PromoTemplate.Deposit),
                  title: this.randomTitle(),
                  description: '',
                  minimumBalance: this.randomBalance(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'MISSING_PROMO_INFORMATION',
        );
        expect(main.body.errors[0].message).eqls('Please input description');
      });
    });

    describe('Given no minimum balance and deposit template', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            createPromo: {
              __args: {
                input: {
                  name: this.randomName(),
                  template: new EnumType(PromoTemplate.Deposit),
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'MISSING_PROMO_INFORMATION',
        );
        expect(main.body.errors[0].message).eqls(
          'Please input minimum balance',
        );
      });
    });

    describe('Given required member fields and deposit template', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            createPromo: {
              __args: {
                input: {
                  name: this.randomName(),
                  template: new EnumType(PromoTemplate.Deposit),
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                  requiredMemberFields: [
                    new EnumType(RequiredMemberFields.BankAccount),
                    new EnumType(RequiredMemberFields.Email),
                    new EnumType(RequiredMemberFields.Realname),
                  ],
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'INVALID_PROMO_INFORMATION_GIVEN',
        );
        expect(main.body.errors[0].message).eqls(
          'Invalid input field: requiredMemberFields for deposit',
        );
      });
    });

    describe('Given no required member fields and sign up template', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            createPromo: {
              __args: {
                input: {
                  name: this.randomName(),
                  template: new EnumType(PromoTemplate.SignUp),
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'MISSING_PROMO_INFORMATION',
        );
        expect(main.body.errors[0].message).eqls(
          'Please input required member fields',
        );
      });
    });

    describe('Given erroneous required member fields and sign up template', () => {
      it('should return an error status code', async function () {
        this.mock = {
          mutation: {
            createPromo: {
              __args: {
                input: {
                  name: this.randomName(),
                  template: new EnumType(PromoTemplate.SignUp),
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                  requiredMemberFields: [this.randomDescription()],
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(400);
      });
    });

    describe('Given minimum balance and sign up template', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            createPromo: {
              __args: {
                input: {
                  name: this.randomName(),
                  template: new EnumType(PromoTemplate.SignUp),
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                  minimumBalance: this.randomBalance(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'INVALID_PROMO_INFORMATION_GIVEN',
        );
        expect(main.body.errors[0].message).eqls(
          'Invalid input field: minimumBalance for sign up',
        );
      });
    });
  });

  describe('List all promos', () => {
    after(() => {
      return PromoModel.deleteMany({});
    });

    before(async function () {
      await PromoModel.deleteMany({});
      this.data1 = await PromoModel.create({
        name: this.randomName(),
        template: PromoTemplate.Deposit,
        title: this.randomTitle(),
        description: this.randomDescription(),
        minimumBalance: this.randomBalance(),
        cursor: Buffer.from(this.randomDescription()),
      });

      this.data2 = await PromoModel.create({
        name: this.randomName(),
        template: PromoTemplate.Deposit,
        title: this.randomTitle(),
        description: this.randomDescription(),
        minimumBalance: this.randomBalance(),
        cursor: Buffer.from(this.randomDescription()),
      });

      this.data3 = await PromoModel.create({
        name: this.randomName(),
        template: PromoTemplate.Deposit,
        title: this.randomTitle(),
        description: this.randomDescription(),
        minimumBalance: this.randomBalance(),
        cursor: Buffer.from(this.randomDescription()),
      });
    });

    describe('Given complete inputs', () => {
      it('should return list of paginated promos', async function () {
        this.mock = {
          query: {
            promos: {
              __args: {
                first: 3,
                after: this.data1.cursor.toString('base64'),
              },
              totalCount: true,
              edges: {
                node: {
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
        expect(main.body.data.promos.totalCount).eqls(3);
        expect(main.body.data.promos.edges).have.length(3);
      });
    });

    describe('Given invalid first', () => {
      it('should throw an error', async function () {
        this.mock = {
          query: {
            promos: {
              __args: {
                first: -1,
                after: this.data1.cursor.toString('base64'),
              },
              totalCount: true,
              edges: {
                node: {
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
        expect(main.body.errors[0].extensions.code).eqls(
          'PAGINATION_INPUT_ERROR',
        );
        expect(main.body.errors[0].message).eqls(`Invalid first`);
      });
    });

    describe('Given invalid after', () => {
      it('should throw an error', async function () {
        this.mock = {
          query: {
            promos: {
              __args: {
                first: 3,
                after: this.randomDescription(),
              },
              totalCount: true,
              edges: {
                node: {
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
        expect(main.body.errors[0].extensions.code).eqls(
          'PAGINATION_INPUT_ERROR',
        );
        expect(main.body.errors[0].message).eqls(`Invalid cursor`);
      });
    });

    describe('Given no first and after', () => {
      it('should return list of all promos', async function () {
        this.mock = {
          query: {
            promos: {
              totalCount: true,
              edges: {
                node: {
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
        expect(main.body.data.promos.totalCount).eqls(3);
        expect(main.body.data.promos.edges).have.length(3);
      });
    });

    describe('Given only first', () => {
      it('should return promos equal to the given first', async function () {
        this.mock = {
          query: {
            promos: {
              __args: {
                first: 3,
              },
              totalCount: true,
              edges: {
                node: {
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
        expect(main.body.data.promos.totalCount).eqls(3);
        expect(main.body.data.promos.edges).have.length(3);
      });
    });

    describe('Given only after', () => {
      it('should return promos starting from the given after', async function () {
        const after = this.data2.cursor.toString('base64');
        this.mock = {
          query: {
            promos: {
              __args: {
                after,
              },
              totalCount: true,
              edges: {
                node: {
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
        expect(main.body.data.promos.totalCount).eqls(2);
        expect(main.body.data.promos.edges).have.length(2);
        expect(main.body.data.promos.edges[0].cursor).eqls(after);
      });
    });
  });

  describe('List promo by ID', () => {
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

    describe('Given existent ID', () => {
      it('should return the promo with that ID', async function () {
        this.mock = {
          query: {
            promo: {
              __args: {
                id: this.baseId,
              },
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
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data.promo.id).eqls(this.baseId);
      });
    });

    describe('Given a non existent ID', () => {
      it('should throw an error', async function () {
        this.mock = {
          query: {
            promo: {
              __args: {
                id: this.mockedId,
              },
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
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls('PROMO_NOT_FOUND');
        expect(main.body.errors[0].message).eqls(
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
          mutation: {
            updatePromo: {
              __args: {
                input: {
                  id: this.mock3,
                  name: this.randomName(),
                  template: new EnumType(PromoTemplate.Deposit),
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                  minimumBalance: this.randomBalance(),
                  status: new EnumType(PromoStatus.Active),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data).property('updatePromo', true);
      });
    });

    describe('Given correct inputs and sign up template', () => {
      it('should return true', async function () {
        this.mock = {
          mutation: {
            updatePromo: {
              __args: {
                input: {
                  id: this.mock2,
                  name: this.randomName(),
                  template: new EnumType(PromoTemplate.SignUp),
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                  requiredMemberFields: [
                    new EnumType(RequiredMemberFields.BankAccount),
                    new EnumType(RequiredMemberFields.Email),
                    new EnumType(RequiredMemberFields.Realname),
                  ],
                  status: new EnumType(PromoStatus.Active),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data).property('updatePromo', true);
      });
    });

    describe('Given invalid status', () => {
      it('should return an error status code', async function () {
        this.mock = {
          mutation: {
            updatePromo: {
              __args: {
                input: {
                  id: this.mock2,
                  name: this.randomName(),
                  template: new EnumType(PromoTemplate.SignUp),
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                  requiredMemberFields: [
                    new EnumType(RequiredMemberFields.BankAccount),
                    new EnumType(RequiredMemberFields.Email),
                    new EnumType(RequiredMemberFields.Realname),
                  ],
                  status: this.randomTitle(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(400);
        expect(main.body.errors[0].extensions.code).eqls(
          'GRAPHQL_VALIDATION_FAILED',
        );
      });
    });

    describe('Given no name', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            updatePromo: {
              __args: {
                input: {
                  id: this.mock2,
                  name: '',
                  template: new EnumType(PromoTemplate.SignUp),
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                  requiredMemberFields: [
                    new EnumType(RequiredMemberFields.BankAccount),
                    new EnumType(RequiredMemberFields.Email),
                    new EnumType(RequiredMemberFields.Realname),
                  ],
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'MISSING_PROMO_INFORMATION',
        );
        expect(main.body.errors[0].message).eqls('Please input name');
      });
    });

    describe('Given no template', () => {
      it('should return with error status code', async function () {
        this.mock = {
          mutation: {
            updatePromo: {
              __args: {
                input: {
                  id: this.mock2,
                  name: this.randomName(),
                  template: '',
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                  requiredMemberFields: [
                    new EnumType(RequiredMemberFields.BankAccount),
                    new EnumType(RequiredMemberFields.Email),
                    new EnumType(RequiredMemberFields.Realname),
                  ],
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(400);
        expect(main.body.errors[0].extensions.code).eqls(
          'GRAPHQL_VALIDATION_FAILED',
        );
      });
    });

    describe('Given invalid template', () => {
      it('should return with error status code', async function () {
        this.mock = {
          mutation: {
            updatePromo: {
              __args: {
                input: {
                  id: this.mock2,
                  name: this.randomName(),
                  template: this.randomTitle(),
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                  requiredMemberFields: [
                    new EnumType(RequiredMemberFields.BankAccount),
                    new EnumType(RequiredMemberFields.Email),
                    new EnumType(RequiredMemberFields.Realname),
                  ],
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(400);
        expect(main.body.errors[0].extensions.code).eqls(
          'GRAPHQL_VALIDATION_FAILED',
        );
      });
    });

    describe('Given no title', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            updatePromo: {
              __args: {
                input: {
                  id: this.mock2,
                  name: this.randomName(),
                  template: new EnumType(PromoTemplate.SignUp),
                  title: '',
                  description: this.randomDescription(),
                  requiredMemberFields: [
                    new EnumType(RequiredMemberFields.BankAccount),
                    new EnumType(RequiredMemberFields.Email),
                    new EnumType(RequiredMemberFields.Realname),
                  ],
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'MISSING_PROMO_INFORMATION',
        );
        expect(main.body.errors[0].message).eqls('Please input title');
      });
    });

    describe('Given no description', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            updatePromo: {
              __args: {
                input: {
                  id: this.mock2,
                  name: this.randomName(),
                  template: new EnumType(PromoTemplate.SignUp),
                  title: this.randomTitle(),
                  description: '',
                  requiredMemberFields: [
                    new EnumType(RequiredMemberFields.BankAccount),
                    new EnumType(RequiredMemberFields.Email),
                    new EnumType(RequiredMemberFields.Realname),
                  ],
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'MISSING_PROMO_INFORMATION',
        );
        expect(main.body.errors[0].message).eqls('Please input description');
      });
    });

    describe('Given no minimum balance and deposit template', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            updatePromo: {
              __args: {
                input: {
                  id: this.mock3,
                  name: this.randomName(),
                  template: new EnumType(PromoTemplate.Deposit),
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'MISSING_PROMO_INFORMATION',
        );
        expect(main.body.errors[0].message).eqls(
          'Please input minimum balance',
        );
      });
    });

    describe('Given required member fields and deposit template', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            updatePromo: {
              __args: {
                input: {
                  id: this.mock3,
                  name: this.randomName(),
                  template: new EnumType(PromoTemplate.Deposit),
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                  requiredMemberFields: [
                    new EnumType(RequiredMemberFields.BankAccount),
                    new EnumType(RequiredMemberFields.Email),
                    new EnumType(RequiredMemberFields.Realname),
                  ],
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'INVALID_PROMO_INFORMATION_GIVEN',
        );
        expect(main.body.errors[0].message).eqls(
          'Invalid input field: requiredMemberFields for deposit',
        );
      });
    });

    describe('Given no required member fields and signup template', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            updatePromo: {
              __args: {
                input: {
                  id: this.mock3,
                  name: this.randomName(),
                  template: new EnumType(PromoTemplate.SignUp),
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'MISSING_PROMO_INFORMATION',
        );
        expect(main.body.errors[0].message).eqls(
          'Please input required member fields',
        );
      });
    });

    describe('Given erroneous required member fields and sign up template', () => {
      it('should return an error status code', async function () {
        this.mock = {
          mutation: {
            updatePromo: {
              __args: {
                input: {
                  id: this.mock3,
                  name: this.randomName(),
                  template: new EnumType(PromoTemplate.SignUp),
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                  requiredMemberFields: [this.randomDescription()],
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(400);
        expect(main.body.errors[0].extensions.code).eqls(
          'GRAPHQL_VALIDATION_FAILED',
        );
      });
    });

    describe('Given minimum balance and signup template', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            updatePromo: {
              __args: {
                input: {
                  id: this.mock3,
                  name: this.randomName(),
                  template: new EnumType(PromoTemplate.SignUp),
                  title: this.randomTitle(),
                  description: this.randomDescription(),
                  minimumBalance: this.randomBalance(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'INVALID_PROMO_INFORMATION_GIVEN',
        );
        expect(main.body.errors[0].message).eqls(
          'Invalid input field: minimumBalance for sign up',
        );
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
          mutation: {
            deletePromo: {
              __args: {
                id: this.draftMockId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data).property('deletePromo', true);
      });
    });

    describe('Given non existent ID', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            deletePromo: {
              __args: {
                id: this.mockedId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls('PROMO_NOT_FOUND');
        expect(main.body.errors[0].message).eqls(
          `Promo with ID: ${this.mockedId} doesn't exists`,
        );
      });
    });

    describe('Given existent ID but is an ACTIVE promo', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            deletePromo: {
              __args: {
                id: this.activeMockId,
              },
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls('ACTIVE_PROMO');
        expect(main.body.errors[0].message).eqls(
          `Active promos can't be deleted`,
        );
      });
    });
  });
});

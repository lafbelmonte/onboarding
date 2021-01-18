import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import mongoose from 'mongoose';
import { Chance } from 'chance';
import { jsonToGraphQLQuery, EnumType } from 'json-to-graphql-query';
import server from '../../../src/index';
import { PromoTemplate, RequiredMemberFields } from '../../../src/types';

import { Promo } from '../../../src/lib/mongoose/models/promo';

chai.use(chaiHttp);

const chance = new Chance();

describe('Promo Queries', function () {
  before(function () {
    this.mockedId = mongoose.Types.ObjectId().toString();

    this.randomName = () => chance.name({ middle: true });
    this.randomTitle = () => chance.word();
    this.randomDescription = () => chance.word();
    this.randomBalance = () => chance.floating();

    this.mock = null;
    this.request = () => chai.request(server.callback());
  });

  describe('Promo Creation', () => {
    afterEach(() => {
      return Promo.deleteMany({});
    });

    beforeEach(() => {
      return Promo.deleteMany({});
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
        expect(main.body.errors[0].message).eqls(
          'Invalid input field: minimumBalance for sign up',
        );
      });
    });
  });

  describe('List all promos', () => {
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
      this.mock = {
        query: {
          promos: {
            id: true,
            name: true,
            status: true,
            template: true,
            title: true,
            createdAt: true,
            updatedAt: true,
            requiredMemberFields: true,
            minimumBalance: true,
            submitted: true,
            enabled: true,
          },
        },
      };

      const query = jsonToGraphQLQuery(this.mock);
      const main = await this.request().post('/graphql').send({ query });
      expect(main.statusCode).to.eqls(200);
      expect(main.body.data.promos).have.length(1);
    });
  });

  describe('List promo by ID', () => {
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
              requiredMemberFields: true,
              minimumBalance: true,
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
                requiredMemberFields: true,
                minimumBalance: true,
                submitted: true,
                enabled: true,
              },
            },
          };

          const query = jsonToGraphQLQuery(this.mock);
          const main = await this.request().post('/graphql').send({ query });
          expect(main.statusCode).to.eqls(200);
          expect(main.body.errors[0].message).eqls(`Promo not found`);
        });
      });
    });
  });
});

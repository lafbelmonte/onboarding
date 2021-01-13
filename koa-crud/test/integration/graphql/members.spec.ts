import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import mongoose from 'mongoose';
import { Chance } from 'chance';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import server from '../../../src/index';

import { Member } from '../../../src/lib/mongoose/models/member';

chai.use(chaiHttp);

const chance = new Chance();

describe('Member Queries', function () {
  before(function () {
    this.mockedId = mongoose.Types.ObjectId().toString();
    this.randomRealName = () => chance.name({ middle: true });
    this.randomUsername = () => chance.word();
    this.randomPassword = () => chance.word();
    this.mock = null;
    this.request = () => chai.request(server.callback());
  });

  describe('Member Creation', () => {
    afterEach(() => {
      return Member.deleteMany({});
    });

    beforeEach(() => {
      return Member.deleteMany({});
    });

    describe('Given correct inputs', () => {
      it('should return true', async function () {
        this.mock = {
          mutation: {
            createMember: {
              __args: {
                input: {
                  username: this.randomUsername(),
                  password: this.randomPassword(),
                  realName: this.randomRealName(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data).property('createMember', true);
      });
    });

    describe('Given no username', () => {
      it('should return error', async function () {
        this.mock = {
          mutation: {
            createMember: {
              __args: {
                input: {
                  username: '',
                  password: this.randomPassword(),
                  realName: this.randomRealName(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls('Please input username');
      });
    });

    describe('Given no password', () => {
      it('should return error', async function () {
        this.mock = {
          mutation: {
            createMember: {
              __args: {
                input: {
                  username: this.randomUsername(),
                  password: '',
                  realName: this.randomRealName(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls('Please input password');
      });
    });

    describe('Given existing username', () => {
      it('should return error', async function () {
        this.mock = {
          mutation: {
            createMember: {
              __args: {
                input: {
                  username: this.randomUsername(),
                  password: this.randomPassword(),
                  realName: this.randomRealName(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        await this.request().post('/graphql').send({ query });
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls('Username already exists');
      });
    });
  });
});

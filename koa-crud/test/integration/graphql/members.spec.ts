import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';

import mongoose from 'mongoose';
import { Chance } from 'chance';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import server from '../../../src/index';

import MemberModel from '../../../src/lib/mongoose/models/member';

import { closeDatabase, initializeDatabase } from '../../../src/lib/mongoose';

chai.use(chaiHttp);

const chance = new Chance();

describe('Member Queries', function () {
  before(async function () {
    await initializeDatabase();
    this.mockedId = mongoose.Types.ObjectId().toString();
    this.randomRealName = () => chance.name({ middle: true });
    this.randomUsername = () => chance.word();
    this.randomPassword = () => chance.word();
    this.mock = null;
    this.request = () => chai.request(server.callback());
  });

  after(async function () {
    await closeDatabase();
  });

  describe('Member Creation', () => {
    afterEach(() => {
      return MemberModel.deleteMany({});
    });

    beforeEach(() => {
      return MemberModel.deleteMany({});
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
        expect(main.body.errors[0].extensions.code).eqls(
          'MISSING_MEMBER_INFORMATION',
        );
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
        expect(main.body.errors[0].extensions.code).eqls(
          'MISSING_MEMBER_INFORMATION',
        );
        expect(main.body.errors[0].message).eqls('Please input password');
      });
    });

    describe('Given existing username', () => {
      it('should return error', async function () {
        const username = this.randomUsername();
        this.mock = {
          mutation: {
            createMember: {
              __args: {
                input: {
                  username,
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
        expect(main.body.errors[0].extensions.code).eqls('EXISTING_MEMBER');
        expect(main.body.errors[0].message).eqls(
          `Username: ${username} already exists`,
        );
      });
    });
  });

  describe('List all members', () => {
    after(() => {
      return MemberModel.deleteMany({});
    });

    before(async function () {
      await MemberModel.deleteMany({});
      this.data1 = await MemberModel.create({
        username: this.randomUsername(),
        password: this.randomPassword(),
        realName: this.randomRealName(),
        cursor: Buffer.from(this.randomRealName()),
      });

      this.data2 = await MemberModel.create({
        username: this.randomUsername(),
        password: this.randomPassword(),
        realName: this.randomRealName(this.randomRealName()),
        cursor: Buffer.from(this.randomRealName()),
      });

      this.data3 = await MemberModel.create({
        username: this.randomUsername(),
        password: this.randomPassword(),
        realName: this.randomRealName(this.randomRealName()),
        cursor: Buffer.from(this.randomRealName()),
      });
    });

    describe('Given complete inputs', () => {
      it('should return list of paginated members', async function () {
        this.mock = {
          query: {
            members: {
              __args: {
                first: 3,
                after: this.data1.cursor.toString('base64'),
              },
              totalCount: true,
              edges: {
                node: {
                  id: true,
                  username: true,
                  realName: true,
                  createdAt: true,
                  updatedAt: true,
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
        expect(main.body.data.members.totalCount).eqls(3);
        expect(main.body.data.members.edges).have.length(3);
      });
    });

    describe('Given invalid first', () => {
      it('should throw an error', async function () {
        this.mock = {
          query: {
            members: {
              __args: {
                first: -1,
                after: this.data1.cursor.toString('base64'),
              },
              totalCount: true,
              edges: {
                node: {
                  id: true,
                  username: true,
                  realName: true,
                  createdAt: true,
                  updatedAt: true,
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
            members: {
              __args: {
                first: -1,
                after: this.randomRealName(),
              },
              totalCount: true,
              edges: {
                node: {
                  id: true,
                  username: true,
                  realName: true,
                  createdAt: true,
                  updatedAt: true,
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
      it('should return all paginated members', async function () {
        this.mock = {
          query: {
            members: {
              totalCount: true,
              edges: {
                node: {
                  id: true,
                  username: true,
                  realName: true,
                  createdAt: true,
                  updatedAt: true,
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
        expect(main.body.data.members.totalCount).eqls(3);
        expect(main.body.data.members.edges).have.length(3);
      });
    });

    describe('Given only first', () => {
      it('should return members equal to the given first', async function () {
        this.mock = {
          query: {
            members: {
              __args: {
                first: 2,
              },
              totalCount: true,
              edges: {
                node: {
                  id: true,
                  username: true,
                  realName: true,
                  createdAt: true,
                  updatedAt: true,
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
        expect(main.body.data.members.totalCount).eqls(2);
        expect(main.body.data.members.edges).have.length(2);
      });
    });

    describe('Given only after', () => {
      it('should return members starting from the given after', async function () {
        const after = this.data2.cursor.toString('base64');

        this.mock = {
          query: {
            members: {
              __args: {
                after,
              },
              totalCount: true,
              edges: {
                node: {
                  id: true,
                  username: true,
                  realName: true,
                  createdAt: true,
                  updatedAt: true,
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
        expect(main.body.data.members.totalCount).eqls(2);
        expect(main.body.data.members.edges).have.length(2);
        expect(main.body.data.members.edges[0].cursor).eqls(after);
      });
    });
  });

  describe('List member by ID', () => {
    after(() => {
      return MemberModel.deleteMany({});
    });

    before(async function () {
      await MemberModel.deleteMany({});
      this.mock = await MemberModel.create({
        username: this.randomUsername(),
        password: this.randomPassword(),
        realName: this.randomRealName(),
      });

      this.baseId = this.mock._id;
    });

    describe('GIVEN an existing and valid ID', () => {
      it('should return the member with that ID', async function () {
        this.mock = {
          query: {
            member: {
              __args: {
                id: this.mock._id,
              },
              id: true,
              username: true,
              realName: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data.member.id).eqls(this.baseId);
      });
    });

    describe('GIVEN a non existent ID', () => {
      it(`should throw an error`, async function () {
        this.mock = {
          query: {
            member: {
              __args: {
                id: this.mockedId,
              },
              id: true,
              username: true,
              realName: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls('MEMBER_NOT_FOUND');
        expect(main.body.errors[0].message).eqls(
          `Member with ID: ${this.mockedId} doesn't exists`,
        );
      });
    });
  });

  describe('Updating a member', () => {
    after(() => {
      return MemberModel.deleteMany({});
    });

    before(async function () {
      await MemberModel.deleteMany({});
      this.mock = await MemberModel.create({
        username: this.randomUsername(),
        password: this.randomPassword(),
        realName: this.randomRealName(),
      });

      this.baseId = this.mock._id;
    });

    describe('Given correct inputs', () => {
      it('should return true', async function () {
        this.mock = {
          mutation: {
            updateMember: {
              __args: {
                input: {
                  id: this.baseId,
                  username: this.randomUsername(),
                  realName: this.randomRealName(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data).property('updateMember', true);
      });
    });

    describe('Given no username', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            updateMember: {
              __args: {
                input: {
                  id: this.baseId,
                  username: '',
                  realName: this.randomRealName(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'MISSING_MEMBER_INFORMATION',
        );
        expect(main.body.errors[0].message).eqls('Please input username');
      });
    });

    describe('Given non existent ID', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            updateMember: {
              __args: {
                input: {
                  id: this.mockedId,
                  username: '',
                  realName: this.randomRealName(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls('MEMBER_NOT_FOUND');
        expect(main.body.errors[0].message).eqls(
          `Member with ID: ${this.mockedId} doesn't exists`,
        );
      });
    });

    describe('Given existing username', () => {
      it('should throw an error', async function () {
        const data = await MemberModel.create({
          username: this.randomUsername(),
          password: this.randomPassword(),
          realName: this.randomRealName(),
        });

        this.mock = {
          mutation: {
            updateMember: {
              __args: {
                input: {
                  id: this.baseId,
                  username: data.username,
                  realName: this.randomRealName(),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls('EXISTING_MEMBER');
        expect(main.body.errors[0].message).eqls(
          `Username: ${data.username} already exists`,
        );
      });
    });
  });

  describe('Member Deletion', () => {
    afterEach(() => {
      return MemberModel.deleteMany({});
    });

    beforeEach(() => {
      return MemberModel.deleteMany({});
    });

    describe('Given an existent ID', () => {
      it('should return true', async function () {
        const data = await MemberModel.create({
          username: this.randomUsername(),
          password: this.randomPassword(),
          realName: this.randomRealName(),
        });

        this.mock = {
          mutation: {
            deleteMember: {
              __args: {
                id: data._id,
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data).property('deleteMember', true);
      });
    });

    describe('Given a non existent ID', () => {
      it('should return true', async function () {
        this.mock = {
          mutation: {
            deleteMember: {
              __args: {
                id: this.mockedId,
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls('MEMBER_NOT_FOUND');
        expect(main.body.errors[0].message).eqls(
          `Member with ID: ${this.mockedId} doesn't exists`,
        );
      });
    });
  });
});

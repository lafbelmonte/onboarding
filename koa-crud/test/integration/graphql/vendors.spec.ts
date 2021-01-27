import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcrypt';

import mongoose from 'mongoose';
import { Chance } from 'chance';
import { jsonToGraphQLQuery, EnumType } from 'json-to-graphql-query';
import server from '../../../src/index';

import VendorModel, {
  VendorType,
} from '../../../src/lib/mongoose/models/vendor';
import MemberModel from '../../../src/lib/mongoose/models/member';

import { closeDatabase, initializeDatabase } from '../../../src/lib/mongoose';

chai.use(chaiHttp);

const chance = new Chance();

describe('Vendor Queries', function () {
  before(async function () {
    await initializeDatabase();
    this.mockedId = mongoose.Types.ObjectId().toString();
    this.randomName = () => chance.name({ middle: true });
    this.randomRealName = () => chance.name({ middle: true });
    this.randomUsername = () => chance.word();
    this.randomPassword = () => chance.word();
    this.mock = null;
    this.request = () => chai.request(server.callback());

    const username = this.randomUsername();
    const password = this.randomPassword();

    await MemberModel.create({
      username,
      password: await bcrypt.hash(password, 10),
      realName: this.randomRealName(),
    });

    const account = await this.request().post(`/auth`).send({
      username,
      password,
    });

    this.token = account.body.token;
  });

  after(async function () {
    await MemberModel.deleteMany({});
    await closeDatabase();
  });

  describe('Vendor Creation', () => {
    afterEach(() => {
      return VendorModel.deleteMany({});
    });

    beforeEach(() => {
      return VendorModel.deleteMany({});
    });

    describe('Given no token', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            createVendor: {
              __args: {
                input: {
                  name: this.randomName(),
                  type: new EnumType(VendorType.Seamless),
                },
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
            createVendor: {
              __args: {
                input: {
                  name: this.randomName(),
                  type: new EnumType(VendorType.Seamless),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.randomName()}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls('NOT_ALLOWED_ERROR');
        expect(main.body.errors[0].message).eqls(
          'You are not allowed to access this resource',
        );
      });
    });

    describe('Given correct inputs and SEAMLESS type', () => {
      it('should return true', async function () {
        this.mock = {
          mutation: {
            createVendor: {
              __args: {
                input: {
                  name: this.randomName(),
                  type: new EnumType(VendorType.Seamless),
                },
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
        expect(main.body.data).property('createVendor', true);
      });
    });

    describe('Given correct inputs and TRANSFER type', () => {
      it('should return true', async function () {
        this.mock = {
          mutation: {
            createVendor: {
              __args: {
                input: {
                  name: this.randomName(),
                  type: new EnumType(VendorType.Transfer),
                },
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
        expect(main.body.data).property('createVendor', true);
      });
    });

    describe('Given no name', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            createVendor: {
              __args: {
                input: {
                  name: '',
                  type: new EnumType(VendorType.Transfer),
                },
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
          'MISSING_VENDOR_INFORMATION',
        );
        expect(main.body.errors[0].message).eqls('Please input name');
      });
    });

    describe('Given invalid type', () => {
      it('should throw an error and return an error status code', async function () {
        this.mock = {
          mutation: {
            createVendor: {
              __args: {
                input: {
                  name: this.randomName(),
                  type: `${this.randomName()}`,
                },
              },
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
          'GRAPHQL_VALIDATION_FAILED',
        );
      });
    });

    describe('Given no type', () => {
      it('should throw an error and return error status code', async function () {
        this.mock = {
          mutation: {
            createVendor: {
              __args: {
                input: {
                  name: this.randomName(),
                  type: '',
                },
              },
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
          'GRAPHQL_VALIDATION_FAILED',
        );
      });
    });

    describe('Given an existing vendor name', () => {
      it('should throw an error', async function () {
        const data = await VendorModel.create({
          name: this.randomName(),
          type: VendorType.Seamless,
        });

        this.mock = {
          mutation: {
            createVendor: {
              __args: {
                input: {
                  name: data.name,
                  type: new EnumType(VendorType.Seamless),
                },
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
        expect(main.body.errors[0].extensions.code).eqls('EXISTING_VENDOR');
        expect(main.body.errors[0].message).eqls('Vendor already exists');
      });
    });
  });

  describe('List all vendors', () => {
    after(() => {
      return VendorModel.deleteMany({});
    });

    before(async function () {
      await VendorModel.deleteMany({});
      this.data1 = await VendorModel.create({
        name: this.randomName(),
        type: VendorType.Seamless,
        cursor: Buffer.from(this.randomName()),
      });

      this.data2 = await VendorModel.create({
        name: this.randomName(),
        type: VendorType.Seamless,
        cursor: Buffer.from(this.randomName()),
      });

      this.data3 = await VendorModel.create({
        name: this.randomName(),
        type: VendorType.Seamless,
        cursor: Buffer.from(this.randomName()),
      });
    });

    describe('Given no token', () => {
      it('should throw an error', async function () {
        this.mock = {
          query: {
            vendors: {
              __args: {
                first: 2,
                after: this.data1.cursor.toString('base64'),
              },
              totalCount: true,
              edges: {
                node: {
                  id: true,
                  name: true,
                  type: true,
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
        expect(main.body.errors[0].extensions.code).eqls('NOT_ALLOWED_ERROR');
        expect(main.body.errors[0].message).eqls(
          'You are not allowed to access this resource',
        );
      });
    });

    describe('Given erroneous token', () => {
      it('should throw an error', async function () {
        this.mock = {
          query: {
            vendors: {
              __args: {
                first: 2,
                after: this.data1.cursor.toString('base64'),
              },
              totalCount: true,
              edges: {
                node: {
                  id: true,
                  name: true,
                  type: true,
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
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.randomName()}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls('NOT_ALLOWED_ERROR');
        expect(main.body.errors[0].message).eqls(
          'You are not allowed to access this resource',
        );
      });
    });

    describe('Given complete inputs', () => {
      it('should return list of paginated vendors', async function () {
        this.mock = {
          query: {
            vendors: {
              __args: {
                first: 3,
                after: this.data1.cursor.toString('base64'),
              },
              totalCount: true,
              edges: {
                node: {
                  id: true,
                  name: true,
                  type: true,
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
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data.vendors.totalCount).eqls(3);
        expect(main.body.data.vendors.edges).have.length(3);
      });
    });

    describe('Given invalid first', () => {
      it('should throw an error', async function () {
        this.mock = {
          query: {
            vendors: {
              __args: {
                first: -1,
                after: this.data1.cursor.toString('base64'),
              },
              totalCount: true,
              edges: {
                node: {
                  id: true,
                  name: true,
                  type: true,
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
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
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
            vendors: {
              __args: {
                first: 3,
                after: this.randomName(),
              },
              totalCount: true,
              edges: {
                node: {
                  id: true,
                  name: true,
                  type: true,
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
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls(
          'PAGINATION_INPUT_ERROR',
        );
        expect(main.body.errors[0].message).eqls(`Invalid cursor`);
      });
    });

    describe('Given no after and first', () => {
      it('should return list of paginated vendors', async function () {
        this.mock = {
          query: {
            vendors: {
              totalCount: true,
              edges: {
                node: {
                  id: true,
                  name: true,
                  type: true,
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
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data.vendors.totalCount).eqls(3);
        expect(main.body.data.vendors.edges).have.length(3);
      });
    });

    describe('Given only first', () => {
      it('should return vendors equal to the given first', async function () {
        this.mock = {
          query: {
            vendors: {
              __args: {
                first: 3,
              },
              totalCount: true,
              edges: {
                node: {
                  id: true,
                  name: true,
                  type: true,
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
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data.vendors.totalCount).eqls(3);
        expect(main.body.data.vendors.edges).have.length(3);
      });
    });

    describe('Given only after', () => {
      it('should return vendors starting from the given after', async function () {
        const after = this.data2.cursor.toString('base64');
        this.mock = {
          query: {
            vendors: {
              __args: {
                after,
              },
              totalCount: true,
              edges: {
                node: {
                  id: true,
                  name: true,
                  type: true,
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
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data.vendors.totalCount).eqls(2);
        expect(main.body.data.vendors.edges).have.length(2);
        expect(main.body.data.vendors.edges[0].cursor).eqls(after);
      });
    });
  });

  describe('List vendor by ID', () => {
    after(() => {
      return VendorModel.deleteMany({});
    });

    before(async function () {
      await VendorModel.deleteMany({});
      this.mock = await VendorModel.create({
        name: this.randomName(),
        type: VendorType.Seamless,
      });

      this.baseId = this.mock._id;
    });

    describe('Given no token', () => {
      it('should throw an error', async function () {
        this.mock = {
          query: {
            vendor: {
              __args: {
                id: this.baseId,
              },
              id: true,
              name: true,
              type: true,
              createdAt: true,
              updatedAt: true,
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
          query: {
            vendor: {
              __args: {
                id: this.baseId,
              },
              id: true,
              name: true,
              type: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.randomName()}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls('NOT_ALLOWED_ERROR');
        expect(main.body.errors[0].message).eqls(
          'You are not allowed to access this resource',
        );
      });
    });

    describe('GIVEN existent ID', () => {
      it('should return the vendor with that ID', async function () {
        this.mock = {
          query: {
            vendor: {
              __args: {
                id: this.baseId,
              },
              id: true,
              name: true,
              type: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.data.vendor.id).eqls(this.baseId);
      });
    });

    describe('GIVEN non existent ID', () => {
      it('should throw an error', async function () {
        this.mock = {
          query: {
            vendor: {
              __args: {
                id: this.mockedId,
              },
              id: true,
              name: true,
              type: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        };

        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.token}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls('VENDOR_NOT_FOUND');
        expect(main.body.errors[0].message).eqls(
          `Vendor with ID: ${this.mockedId} doesn't exists`,
        );
      });
    });
  });

  describe('Updating a vendor', () => {
    after(() => {
      return VendorModel.deleteMany({});
    });

    before(async function () {
      await VendorModel.deleteMany({});
      this.mock = await VendorModel.create({
        name: this.randomName(),
        type: VendorType.Seamless,
      });

      this.baseId = this.mock._id;
    });

    describe('Given no token', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            updateVendor: {
              __args: {
                input: {
                  id: this.baseId,
                  name: this.randomName(),
                  type: new EnumType(VendorType.Transfer),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request().post('/graphql').send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls(
          'You are not allowed to access this resource',
        );
      });
    });

    describe('Given erroneous token', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            updateVendor: {
              __args: {
                input: {
                  id: this.baseId,
                  name: this.randomName(),
                  type: new EnumType(VendorType.Transfer),
                },
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.randomName()}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls('NOT_ALLOWED_ERROR');
        expect(main.body.errors[0].message).eqls(
          'You are not allowed to access this resource',
        );
      });
    });

    describe('GIVEN a valid ID and TRANSFER type', () => {
      it('should return true', async function () {
        this.mock = {
          mutation: {
            updateVendor: {
              __args: {
                input: {
                  id: this.baseId,
                  name: this.randomName(),
                  type: new EnumType(VendorType.Transfer),
                },
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
        expect(main.body.data).property('updateVendor', true);
      });
    });

    describe('GIVEN a valid ID and Seamless type', () => {
      it('should return true', async function () {
        this.mock = {
          mutation: {
            updateVendor: {
              __args: {
                input: {
                  id: this.baseId,
                  name: this.randomName(),
                  type: new EnumType(VendorType.Seamless),
                },
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
        expect(main.body.data).property('updateVendor', true);
      });
    });

    describe('GIVEN no name', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            updateVendor: {
              __args: {
                input: {
                  id: this.baseId,
                  name: '',
                  type: new EnumType(VendorType.Seamless),
                },
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
          'MISSING_VENDOR_INFORMATION',
        );
        expect(main.body.errors[0].message).eqls('Please input name');
      });
    });

    describe('GIVEN no type', () => {
      it('should throw an error and return error status code', async function () {
        this.mock = {
          mutation: {
            updateVendor: {
              __args: {
                input: {
                  id: this.baseId,
                  name: this.randomName(),
                  type: '',
                },
              },
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
          'GRAPHQL_VALIDATION_FAILED',
        );
      });
    });

    describe('GIVEN invalid type', () => {
      it('should throw an error and return error status code', async function () {
        this.mock = {
          mutation: {
            updateVendor: {
              __args: {
                input: {
                  id: this.baseId,
                  name: this.randomName(),
                  type: `${this.randomName()}`,
                },
              },
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
          'GRAPHQL_VALIDATION_FAILED',
        );
      });
    });

    describe('GIVEN non existent ID', () => {
      it('should throw an error', async function () {
        this.mock = {
          mutation: {
            updateVendor: {
              __args: {
                input: {
                  id: this.mockedId,
                  name: this.randomName(),
                  type: new EnumType(VendorType.Transfer),
                },
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
        expect(main.body.errors[0].extensions.code).eqls('VENDOR_NOT_FOUND');
        expect(main.body.errors[0].message).eqls(
          `Vendor with ID: ${this.mockedId} doesn't exists`,
        );
      });
    });
  });

  describe('Deleting a vendor', () => {
    after(() => {
      return VendorModel.deleteMany({});
    });

    before(async function () {
      await VendorModel.deleteMany({});
    });

    describe('Given no token', () => {
      it('should throw an error', async function () {
        const data = await VendorModel.create({
          name: this.randomName(),
          type: VendorType.Seamless,
        });

        this.mock = {
          mutation: {
            deleteVendor: {
              __args: {
                id: data._id,
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
        const data = await VendorModel.create({
          name: this.randomName(),
          type: VendorType.Seamless,
        });

        this.mock = {
          mutation: {
            deleteVendor: {
              __args: {
                id: data._id,
              },
            },
          },
        };
        const query = jsonToGraphQLQuery(this.mock);
        const main = await this.request()
          .post('/graphql')
          .set('Authorization', `Bearer ${this.randomName()}`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].extensions.code).eqls('NOT_ALLOWED_ERROR');
        expect(main.body.errors[0].message).eqls(
          'You are not allowed to access this resource',
        );
      });
    });

    describe('GIVEN an existent ID', () => {
      it('should return true', async function () {
        const data = await VendorModel.create({
          name: this.randomName(),
          type: VendorType.Seamless,
        });

        this.mock = {
          mutation: {
            deleteVendor: {
              __args: {
                id: data._id,
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
        expect(main.body.data).property('deleteVendor', true);
      });
    });

    describe('GIVEN a non existent ID', () => {
      it('should throw an error', async function () {
        await VendorModel.create({
          name: this.randomName(),
          type: VendorType.Seamless,
        });

        this.mock = {
          mutation: {
            deleteVendor: {
              __args: {
                id: this.mockedId,
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
        expect(main.body.errors[0].extensions.code).eqls('VENDOR_NOT_FOUND');
        expect(main.body.errors[0].message).eqls(
          `Vendor with ID ${this.mockedId} doesn't exists`,
        );
      });
    });
  });
});

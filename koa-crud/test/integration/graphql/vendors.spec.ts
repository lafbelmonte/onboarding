import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import bcrypt from 'bcrypt';

import mongoose from 'mongoose';
import { Chance } from 'chance';
import { jsonToGraphQLQuery, EnumType } from 'json-to-graphql-query';
import server from '../../../src/index';

import { Vendor } from '../../../src/lib/mongoose/models/vendor';
import { Member } from '../../../src/lib/mongoose/models/member';

import { VendorType } from '../../../src/types';

chai.use(chaiHttp);

const chance = new Chance();

describe('Vendor Queries', function () {
  before(async function () {
    this.mockedId = mongoose.Types.ObjectId().toString();
    this.randomName = () => chance.name({ middle: true });
    this.randomRealName = () => chance.name({ middle: true });
    this.randomUsername = () => chance.word();
    this.randomPassword = () => chance.word();
    this.mock = null;
    this.request = () => chai.request(server.callback());

    const username = this.randomUsername();
    const password = this.randomPassword();

    await Member.create({
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

  after(() => {
    return Member.deleteMany({});
  });

  describe('Vendor Creation', () => {
    afterEach(() => {
      return Vendor.deleteMany({});
    });

    beforeEach(() => {
      return Vendor.deleteMany({});
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
        expect(main.body.errors[0].message).eqls('Forbidden');
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
          .set('Authorization', `Bearer qwe`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls('Forbidden');
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
                  type: 'qwe',
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
      });
    });

    describe('Given an existing vendor name', () => {
      it('should throw an error', async function () {
        const data = await Vendor.create({
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
        expect(main.body.errors[0].message).eqls('Vendor already exists');
      });
    });
  });

  describe('List all vendors', () => {
    after(() => {
      return Vendor.deleteMany({});
    });

    before(async function () {
      await Vendor.deleteMany({});
      this.mock = await Vendor.create({
        name: this.randomName(),
        type: VendorType.Seamless,
      });
    });

    describe('Given no token', () => {
      it('should throw an error', async function () {
        this.mock = {
          query: {
            vendors: {
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
        expect(main.body.errors[0].message).eqls('Forbidden');
      });
    });

    describe('Given erroneous token', () => {
      it('should throw an error', async function () {
        this.mock = {
          query: {
            vendors: {
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
          .set('Authorization', `Bearer qwe`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls('Forbidden');
      });
    });

    it('should return list of vendors', async function () {
      this.mock = {
        query: {
          vendors: {
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
      expect(main.body.data.vendors).have.length(1);
    });
  });

  describe('List vendor by ID', () => {
    after(() => {
      return Vendor.deleteMany({});
    });

    before(async function () {
      await Vendor.deleteMany({});
      this.mock = await Vendor.create({
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
        expect(main.body.errors[0].message).eqls('Forbidden');
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
          .set('Authorization', `Bearer qwe`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls('Forbidden');
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
        expect(main.body.errors[0].message).eqls(`Vendor doesn't exist`);
      });
    });
  });

  describe('Updating a vendor', () => {
    after(() => {
      return Vendor.deleteMany({});
    });

    before(async function () {
      await Vendor.deleteMany({});
      this.mock = await Vendor.create({
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
        expect(main.body.errors[0].message).eqls('Forbidden');
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
          .set('Authorization', `Bearer qwe`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls('Forbidden');
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
                  type: 'qwe',
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
        expect(main.body.errors[0].message).eqls(`Vendor ID doesn't exist`);
      });
    });
  });

  describe('Deleting a vendor', () => {
    after(() => {
      return Vendor.deleteMany({});
    });

    before(async function () {
      await Vendor.deleteMany({});
    });

    describe('Given no token', () => {
      it('should throw an error', async function () {
        const data = await Vendor.create({
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
        expect(main.body.errors[0].message).eqls('Forbidden');
      });
    });

    describe('Given erroneous token', () => {
      it('should throw an error', async function () {
        const data = await Vendor.create({
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
          .set('Authorization', `Bearer qwe`)
          .send({ query });
        expect(main.statusCode).to.eqls(200);
        expect(main.body.errors[0].message).eqls('Forbidden');
      });
    });

    describe('GIVEN an existent ID', () => {
      it('should return true', async function () {
        const data = await Vendor.create({
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
        await Vendor.create({
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
        expect(main.body.errors[0].message).eqls(`Vendor doesn't exist`);
      });
    });
  });
});

import chai, { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';

import { Chance } from 'chance';

import { memberEntity } from '../../src/entities/member';

const chance = new Chance();

chai.use(chaiAsPromised);

describe('Member Entity', () => {
  before(function () {
    this.randomRealName = () => chance.name({ middle: true });
    this.randomUsername = () => chance.word();
    this.randomPassword = () => chance.word();
    this.mock = null;
  });

  describe('Given correct input', () => {
    it('should return the expected output', async function () {
      this.mock = {
        username: this.randomUsername(),
        password: this.randomPassword(),
        realName: this.randomRealName(),
      };

      await expect(
        memberEntity(this.mock),
      ).to.eventually.fulfilled.and.have.keys(
        'username',
        'password',
        'realName',
        'email',
        'balance',
        'bankAccount',
      );
    });
  });

  describe('Given no username', () => {
    it('should throw an error', async function () {
      this.mock = {
        username: '',
        password: this.randomPassword(),
        realName: this.randomRealName(),
      };

      await expect(memberEntity(this.mock)).to.eventually.rejectedWith(
        'Please input username',
      );
    });
  });
});

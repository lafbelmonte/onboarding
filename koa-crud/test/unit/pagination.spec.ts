/* eslint-disable no-unused-expressions */
import { expect } from 'chai';

import { Chance } from 'chance';

import paginate from '../../src/pagination';

const chance = new Chance();

describe('Pagination Function', () => {
  before(function () {
    this.randomString = () => chance.word();
    const buffer1 = Buffer.from(this.randomString());
    const buffer2 = Buffer.from(this.randomString());
    const buffer3 = Buffer.from(this.randomString());
    this.mockData = [
      {
        id: this.randomString(),
        cursorBuffer: buffer1,
        cursor: buffer1,
      },
      {
        id: this.randomString(),
        cursorBuffer: buffer2,
        cursor: buffer2,
      },
      {
        id: this.randomString(),
        cursorBuffer: buffer3,
        cursor: buffer3,
      },
    ];
  });

  describe('Given 3 for first and first element as after', () => {
    it('should return 3 total count and false has next page', function () {
      const result = paginate({
        data: this.mockData,
        first: 3,
        after: this.mockData[0].cursorBuffer,
      });

      expect(result.totalCount).eqls(3);
      expect(result.edges[0].node.cursor).eqls(this.mockData[0].cursorBuffer);
      expect(result.pageInfo.hasNextPage).be.false;
    });
  });

  describe('Given 2 for first and first element as after', () => {
    it('should return 2 total count and true has next page', function () {
      const result = paginate({
        data: this.mockData,
        first: 2,
        after: this.mockData[0].cursorBuffer,
      });

      expect(result.totalCount).eqls(2);
      expect(result.edges[0].node.cursor).eqls(this.mockData[0].cursorBuffer);
      expect(result.pageInfo.hasNextPage).be.true;
    });
  });

  describe('Given last element as after', () => {
    it('should return 1 total count and false has next page', function () {
      const result = paginate({
        data: this.mockData,
        first: 2,
        after: this.mockData[2].cursorBuffer,
      });

      expect(result.totalCount).eqls(1);
      expect(result.edges[0].node.cursor).eqls(this.mockData[2].cursorBuffer);
      expect(result.pageInfo.hasNextPage).be.false;
    });
  });

  describe('Given invalid first', () => {
    it('should throw an error', function () {
      expect(() => {
        paginate({
          data: this.mockData,
          first: -1,
          after: this.mockData[2].cursorBuffer,
        });
      }).to.throw(Error, 'Invalid first');
    });
  });

  describe('Given non existent cursor', () => {
    it('should throw an error', function () {
      expect(() => {
        paginate({
          data: this.mockData,
          first: 3,
          after: this.randomString(),
        });
      }).to.throw(Error, 'Invalid cursor');
    });
  });
});

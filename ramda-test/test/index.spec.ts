/*eslint-disable */
import { expect } from 'chai';
import {
  IsLastInStock,
  averageDollarValue,
  fastestCar,
  getEachAccountsTotalPayout,
} from '../src/index';

describe('is last in stock', () => {
  const cars = [
    {
      name: 'Aston Martin One-77',
      horsepower: 750,
      dollarValue: 1850000,
      inStock: true,
    },
    {
      name: 'Nissan Skyline GTR',
      horsepower: 850,
      dollarValue: 1950000,
      inStock: true,
    },
  ];
  const cars2 = [
    {
      name: 'Aston Martin One-77',
      horsepower: 750,
      dollarValue: 1850000,
      inStock: true,
    },
    {
      name: 'Nissan Skyline GTR',
      horsepower: 850,
      dollarValue: 1950000,
      inStock: false,
    },
  ];

  it('should return true', () => {
    expect(IsLastInStock(cars)).to.be.true;
  });

  it('should return false', () => {
    expect(IsLastInStock(cars2)).to.be.false;
  });
});

describe('average dollar value', () => {
  const cars = [
    {
      name: 'Aston Martin One-77',
      horsepower: 750,
      dollarValue: 1850000,
      inStock: true,
    },
    {
      name: 'Nissan Skyline GTR',
      horsepower: 850,
      dollarValue: 1950000,
      inStock: true,
    },
  ];

  it('should return the average', () => {
    expect(averageDollarValue(cars)).to.equal(1900000);
  });
});

describe('fastest car', () => {
  const cars = [
    {
      name: 'Aston Martin One-77',
      horsepower: 750,
      dollarValue: 1850000,
      inStock: true,
    },
    {
      name: 'Nissan Skyline GTR',
      horsepower: 850,
      dollarValue: 1950000,
      inStock: true,
    },
  ];

  it('should return the faster car', () => {
    expect(fastestCar(cars)).to.equal('Nissan Skyline GTR is the fastest');
  });
});

describe('fastest car', () => {
  const data = [{ acc_1: 1 }, { acc_1: 2 }, { acc_2: 3 }];

  it('should run the test', () => {
    expect(getEachAccountsTotalPayout(data)).to.eqls({
      acc_1: 3,
      acc_2: 3,
    });
  });
});

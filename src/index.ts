import R from 'ramda';

type Car = {
  name: string;
  horsepower: number;
  dollarValue: number;
  inStock: boolean;
};

// const cars: Car[] = [
//   {
//     name: 'Aston Martin One-77',
//     horsepower: 750,
//     dollarValue: 1850000,
//     inStock: true,
//   },
//   {
//     name: 'Nissan Skyline GTR',
//     horsepower: 850,
//     dollarValue: 1950000,
//     inStock: true,
//   },
// ];

const IsLastInStock = R.compose<Car[], Car, boolean>(R.prop('inStock'), R.last);

const averageDollarValue = R.compose<Car[], number[], number>(
  R.converge(R.divide, [R.sum, R.length]),
  R.map(R.prop('dollarValue')),
);

const fastestCar = R.compose<Car[], Car[], Car, string, string>(
  R.flip(R.concat)(' is the fastest'),
  R.prop('name'),
  R.last,
  R.sortBy(R.prop('horsepower')),
);

// const data = [{ acc_1: 1 }, { acc_1: 2 }, { acc_2: 3 }];

const getEachAccountsTotalPayout = R.compose<any[], any, any, any, any>(
  R.map(R.sum),
  R.map(R.pluck(1)),
  R.groupBy(R.head),
  R.chain(R.toPairs),
);

// [ [ 'acc_1', 1 ], [ 'acc_1', 2 ], [ 'acc_2', 3 ] ]

// {
//     acc_1: [ [ 'acc_1', 1 ], [ 'acc_1', 2 ] ],
//     acc_2: [ [ 'acc_2', 3 ] ]
// }

// { acc_1: [ 1, 2 ], acc_2: [ 3 ] }

// { acc_1: 3, acc_2: 3 }

export {
  IsLastInStock,
  averageDollarValue,
  fastestCar,
  getEachAccountsTotalPayout,
};

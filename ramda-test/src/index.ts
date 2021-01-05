import R from 'ramda';

type Car = {
  name: string;
  horsepower: number;
  dollarValue: number;
  inStock: boolean;
};

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

const getEachAccountsTotalPayout = R.compose<any[], any, any, any, any>(
  R.map(R.sum),
  R.map(R.pluck(1)),
  R.groupBy(R.head),
  R.chain(R.toPairs),
);

export {
  IsLastInStock,
  averageDollarValue,
  fastestCar,
  getEachAccountsTotalPayout,
};

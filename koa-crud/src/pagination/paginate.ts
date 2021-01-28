import rType from 'ramda';

import { Connection } from '@types';

import { PaginationInputError } from '@custom-errors';

export type PaginateInput<T> = {
  data: T[];
  first: number;
  after: string;
};

const makePaginate = ({ R }: { R: typeof rType }) => {
  return function <T extends { cursorBuffer: Buffer }>({
    data,
    first,
    after,
  }: PaginateInput<T>): Connection<T> {
    let startingIndex = 0;

    if (after) {
      startingIndex = R.findIndex(
        R.propEq('cursorBuffer', Buffer.from(after, 'base64')),
      )(data);
    }

    if (startingIndex < 0) {
      throw new PaginationInputError(`Invalid cursor`);
    }

    if (first < 0) {
      throw new PaginationInputError(`Invalid first`);
    }

    const lastIndex = first ? startingIndex + first : data.length;

    const nodes = R.slice(startingIndex, lastIndex, data);

    const edges = R.map((node: any) => {
      return {
        node,
        cursor: node.cursor,
      };
    })(nodes);

    return {
      totalCount: nodes.length,
      pageInfo: {
        endCursor: edges[nodes.length - 1].cursor,
        hasNextPage: lastIndex < data.length,
      },
      edges,
    };
  };
};

export default makePaginate;

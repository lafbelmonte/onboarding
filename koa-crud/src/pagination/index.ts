import R from 'ramda';

import makePaginate from './paginate';
import makePaginateDbLayer from './paginate-db-layer';

const paginate = makePaginate({ R });

export const paginateDbLayer = makePaginateDbLayer({ R });

export default paginate;

import { Vendor } from '../../../lib/mongoose/models/vendor';

import actions from './actions';

const vendorsStore = actions({ Vendor });

export { vendorsStore };

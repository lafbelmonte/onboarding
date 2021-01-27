import VendorModel from '../../../lib/mongoose/models/vendor';

import actions from './actions';

const vendorStore = actions({ VendorModel });

export { vendorStore };

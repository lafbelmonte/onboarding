import { Promo } from '../../../lib/mongoose/models/promo';

import actions from './actions';

const promosStore = actions({ Promo });

export { promosStore };

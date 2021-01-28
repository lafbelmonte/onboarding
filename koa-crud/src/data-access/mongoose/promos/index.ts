import PromoModel from '@lib/mongoose/models/promo';

import actions from './actions';

const promoStore = actions({ PromoModel });

export { promoStore };

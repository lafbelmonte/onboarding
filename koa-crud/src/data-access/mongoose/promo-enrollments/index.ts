import { PromoEnrollment } from '../../../lib/mongoose/models/promo-enrollment';

import actions from './actions';

const promoEnrollmentsStore = actions({ PromoEnrollment });

export { promoEnrollmentsStore };

import { PromoEnrollmentRequest } from '../../../lib/mongoose/models/promo-enrollment-request';

import actions from './actions';

const promoEnrollmentRequestsStore = actions({ PromoEnrollmentRequest });

export { promoEnrollmentRequestsStore };

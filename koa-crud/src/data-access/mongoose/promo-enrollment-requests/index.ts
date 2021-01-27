import PromoEnrollmentRequestModel from '../../../lib/mongoose/models/promo-enrollment-request';

import actions from './actions';

const promoEnrollmentRequestStore = actions({ PromoEnrollmentRequestModel });

export { promoEnrollmentRequestStore };

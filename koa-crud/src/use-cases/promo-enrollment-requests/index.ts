import R from 'ramda';
import camelCase from 'camelcase';
import { membersStore } from '../../data-access/mongoose/members';
import { promosStore } from '../../data-access/mongoose/promos';
import { promoEnrollmentRequestsStore } from '../../data-access/mongoose/promo-enrollment-requests';

import enrollToPromo from './enroll-to-promo';

const enrollToPromoUseCase = enrollToPromo({
  membersStore,
  promosStore,
  R,
  promoEnrollmentRequestsStore,
  camelCase,
});

export { enrollToPromoUseCase };

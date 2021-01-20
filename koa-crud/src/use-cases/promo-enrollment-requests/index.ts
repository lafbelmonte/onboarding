import R from 'ramda';
import camelCase from 'camelcase';
import { membersStore } from '../../data-access/mongoose/members';
import { promosStore } from '../../data-access/mongoose/promos';
import { promoEnrollmentRequestsStore } from '../../data-access/mongoose/promo-enrollment-requests';

import enrollToPromo from './enroll-to-promo';
import selectAllPromoEnrollmentRequests from './select-all-promo-enrollment-requests';
import selectOnePromoEnrollmentRequest from './select-one-promo-enrollment-request';

const enrollToPromoUseCase = enrollToPromo({
  membersStore,
  promosStore,
  R,
  promoEnrollmentRequestsStore,
  camelCase,
});

const selectAllPromoEnrollmentRequestsUseCase = selectAllPromoEnrollmentRequests(
  { promoEnrollmentRequestsStore },
);

const selectOnePromoEnrollmentRequestUseCase = selectOnePromoEnrollmentRequest({
  promoEnrollmentRequestsStore,
});

export {
  enrollToPromoUseCase,
  selectAllPromoEnrollmentRequestsUseCase,
  selectOnePromoEnrollmentRequestUseCase,
};

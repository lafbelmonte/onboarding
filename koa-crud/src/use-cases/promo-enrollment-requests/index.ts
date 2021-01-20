import R from 'ramda';
import camelCase from 'camelcase';
import { membersStore } from '../../data-access/mongoose/members';
import { promosStore } from '../../data-access/mongoose/promos';
import { promoEnrollmentRequestsStore } from '../../data-access/mongoose/promo-enrollment-requests';

import enrollToPromo from './enroll-to-promo';
import selectAllPromoEnrollmentRequests from './select-all-promo-enrollment-requests';
import selectOnePromoEnrollmentRequest from './select-one-promo-enrollment-request';
import approveEnrollmentRequest from './approve-enrollment-request';
import processEnrollmentRequest from './process-enrollment-request';
import rejectEnrollmentRequest from './reject-enrollment-request';

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

const approveEnrollmentRequestUseCase = approveEnrollmentRequest({
  promoEnrollmentRequestsStore,
});

const processEnrollmentRequestUseCase = processEnrollmentRequest({
  promoEnrollmentRequestsStore,
});

const rejectEnrollmentRequestUseCase = rejectEnrollmentRequest({
  promoEnrollmentRequestsStore,
});
export {
  enrollToPromoUseCase,
  selectAllPromoEnrollmentRequestsUseCase,
  selectOnePromoEnrollmentRequestUseCase,
  approveEnrollmentRequestUseCase,
  processEnrollmentRequestUseCase,
  rejectEnrollmentRequestUseCase,
};

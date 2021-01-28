import R from 'ramda';
import camelCase from 'camelcase';
import { memberStore } from '@data-access/mongoose/members';
import { promoStore } from '@data-access/mongoose/promos';
import { promoEnrollmentRequestStore } from '@data-access/mongoose/promo-enrollment-requests';

import enrollToPromo from './enroll-to-promo';
import selectAllPromoEnrollmentRequests from './select-all-promo-enrollment-requests';
import selectOnePromoEnrollmentRequest from './select-one-promo-enrollment-request';
import approveEnrollmentRequest from './approve-enrollment-request';
import processEnrollmentRequest from './process-enrollment-request';
import rejectEnrollmentRequest from './reject-enrollment-request';

const enrollToPromoUseCase = enrollToPromo({
  memberStore,
  promoStore,
  R,
  promoEnrollmentRequestStore,
  camelCase,
});

const selectAllPromoEnrollmentRequestsUseCase = selectAllPromoEnrollmentRequests(
  { promoEnrollmentRequestStore },
);

const selectOnePromoEnrollmentRequestUseCase = selectOnePromoEnrollmentRequest({
  promoEnrollmentRequestStore,
});

const approveEnrollmentRequestUseCase = approveEnrollmentRequest({
  promoEnrollmentRequestStore,
});

const processEnrollmentRequestUseCase = processEnrollmentRequest({
  promoEnrollmentRequestStore,
});

const rejectEnrollmentRequestUseCase = rejectEnrollmentRequest({
  promoEnrollmentRequestStore,
});
export {
  enrollToPromoUseCase,
  selectAllPromoEnrollmentRequestsUseCase,
  selectOnePromoEnrollmentRequestUseCase,
  approveEnrollmentRequestUseCase,
  processEnrollmentRequestUseCase,
  rejectEnrollmentRequestUseCase,
};

import R from 'ramda';

import {
  enrollToPromoUseCase,
  selectAllPromoEnrollmentRequestsUseCase,
  selectOnePromoEnrollmentRequestUseCase,
} from '../../use-cases/promo-enrollment-requests';

import { Connection, PromoEnrollmentRequest } from '../../types/index';

const enrollToPromo = async (obj, args, ctx) => {
  if (!ctx.allowed) {
    throw new Error('Forbidden');
  }

  return enrollToPromoUseCase({
    id: ctx.userId.data,
    info: args,
    source: null,
  });
};

const promoEnrollmentRequests = async (
  obj,
  args,
  ctx,
): Promise<Connection<PromoEnrollmentRequest>> => {
  const promoEnrollmentRequests = await selectAllPromoEnrollmentRequestsUseCase(
    {
      id: null,
      info: null,
      source: null,
    },
  );

  const edges = R.map((promoEnrollmentRequest: PromoEnrollmentRequest) => {
    return {
      node: promoEnrollmentRequest,
      cursor: 'not implemented',
    };
  })(promoEnrollmentRequests);

  return {
    totalCount: 10,
    pageInfo: {
      endCursor: 'not implemented',
      hasNextPage: false,
    },
    edges,
  };
};

const promoEnrollmentRequest = async (obj, args) =>
  selectOnePromoEnrollmentRequestUseCase({
    id: args.id,
    info: null,
    source: null,
  });

export { enrollToPromo, promoEnrollmentRequests, promoEnrollmentRequest };

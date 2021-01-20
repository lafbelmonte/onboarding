import R from 'ramda';

import {
  enrollToPromoUseCase,
  selectAllPromoEnrollmentRequestsUseCase,
  selectOnePromoEnrollmentRequestUseCase,
} from '../../use-cases/promo-enrollment-requests';

import { Connection, PromoEnrollmentRequest } from '../../types/index';

const enrollToPromo = async (
  obj,
  args: PromoEnrollmentRequest,
  ctx,
): Promise<boolean> => {
  if (!ctx.allowed) {
    throw new Error('Forbidden');
  }

  return enrollToPromoUseCase({
    id: ctx.userId.data,
    info: args,
    source: null,
  });
};

const promoEnrollmentRequests = async (): Promise<
  Connection<PromoEnrollmentRequest>
> => {
  const nodes = await selectAllPromoEnrollmentRequestsUseCase({
    id: null,
    info: null,
    source: null,
  });

  const edges = R.map((node: PromoEnrollmentRequest) => {
    return {
      node,
      cursor: 'not implemented',
    };
  })(nodes);

  return {
    totalCount: nodes.length,
    pageInfo: {
      endCursor: 'not implemented',
      hasNextPage: false,
    },
    edges,
  };
};

const promoEnrollmentRequest = async (
  obj,
  args: PromoEnrollmentRequest,
): Promise<PromoEnrollmentRequest> => {
  return selectOnePromoEnrollmentRequestUseCase({
    id: args.id,
    info: null,
    source: null,
  });
};

export { enrollToPromo, promoEnrollmentRequests, promoEnrollmentRequest };

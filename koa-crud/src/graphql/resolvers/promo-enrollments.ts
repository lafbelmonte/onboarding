import {
  enrollToPromoUseCase,
  selectAllPromoEnrollmentRequestsUseCase,
  selectOnePromoEnrollmentRequestUseCase,
  approveEnrollmentRequestUseCase,
  rejectEnrollmentRequestUseCase,
  processEnrollmentRequestUseCase,
} from '../../use-cases/promo-enrollment-requests';

import { NotAllowedError } from '../../custom-errors';

import paginate from '../../pagination';

import { PromoEnrollmentRequestDocument } from '../../lib/mongoose/models/promo-enrollment-request';
import { Connection } from '../../types';

const enrollToPromo = async (obj, args, ctx): Promise<boolean> => {
  if (!ctx.allowed) {
    throw new NotAllowedError('You are not allowed to access this resource');
  }

  return enrollToPromoUseCase({
    info: {
      member: ctx.userId.data,
      promo: args.promo,
    },
  });
};

const promoEnrollmentRequests = async (
  obj,
  args,
): Promise<Connection<PromoEnrollmentRequestDocument>> => {
  const data = await selectAllPromoEnrollmentRequestsUseCase({});

  return paginate({
    data,
    first: args.first,
    after: args.after,
  });
};

const promoEnrollmentRequest = async (
  obj,
  args,
): Promise<PromoEnrollmentRequestDocument> => {
  return selectOnePromoEnrollmentRequestUseCase({
    id: args.id,
  });
};

const processPromoEnrollmentRequest = async (obj, args): Promise<boolean> => {
  return processEnrollmentRequestUseCase({
    id: args.id,
  });
};

const approvePromoEnrollmentRequest = async (obj, args): Promise<boolean> => {
  return approveEnrollmentRequestUseCase({
    id: args.id,
  });
};

const rejectPromoEnrollmentRequest = async (obj, args): Promise<boolean> => {
  return rejectEnrollmentRequestUseCase({
    id: args.id,
  });
};

export {
  enrollToPromo,
  promoEnrollmentRequests,
  promoEnrollmentRequest,
  processPromoEnrollmentRequest,
  approvePromoEnrollmentRequest,
  rejectPromoEnrollmentRequest,
};

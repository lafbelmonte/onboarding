import {
  enrollToPromoUseCase,
  selectAllPromoEnrollmentRequestsUseCase,
  selectOnePromoEnrollmentRequestUseCase,
  approveEnrollmentRequestUseCase,
  rejectEnrollmentRequestUseCase,
  processEnrollmentRequestUseCase,
} from '../../use-cases/promo-enrollment-requests';

import { NotAllowedError } from '../../custom-errors';
import { Connection, PromoEnrollmentRequest } from '../../types/index';
import { paginate } from '../../pagination';

const enrollToPromo = async (
  obj,
  args: PromoEnrollmentRequest,
  ctx,
): Promise<boolean> => {
  if (!ctx.allowed) {
    throw new NotAllowedError('You are not allowed to access this resource');
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
): Promise<Connection<PromoEnrollmentRequest>> => {
  const data = await selectAllPromoEnrollmentRequestsUseCase({
    id: null,
    info: null,
    source: null,
  });

  return paginate(data, args.first, args.after);
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

const processPromoEnrollmentRequest = async (
  obj,
  args: { id: string },
): Promise<boolean> => {
  return processEnrollmentRequestUseCase({
    id: args.id,
    info: null,
    source: null,
  });
};

const approvePromoEnrollmentRequest = async (
  obj,
  args: { id: string },
): Promise<boolean> => {
  return approveEnrollmentRequestUseCase({
    id: args.id,
    info: null,
    source: null,
  });
};

const rejectPromoEnrollmentRequest = async (
  obj,
  args: { id: string },
): Promise<boolean> => {
  return rejectEnrollmentRequestUseCase({
    id: args.id,
    info: null,
    source: null,
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

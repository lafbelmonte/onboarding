import {
  enrollToPromoUseCase,
  selectAllPromoEnrollmentRequestsUseCase,
  selectOnePromoEnrollmentRequestUseCase,
  approveEnrollmentRequestUseCase,
  rejectEnrollmentRequestUseCase,
  processEnrollmentRequestUseCase,
} from '@use-cases/promo-enrollment-requests';

import { NotAllowedError } from '@custom-errors';

import { PromoEnrollmentRequestDocument } from '@lib/mongoose/models/promo-enrollment-request';
import { Connection } from '@types';
import { PaginateInput } from '@pagination/paginate-db-layer';

const enrollToPromo = async (
  parent: null,
  args: {
    promo: string;
  },
  ctx: { allowed: boolean; userId: { data: string } },
): Promise<boolean> => {
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
  parent: null,
  args: Omit<PaginateInput, 'model'>,
): Promise<Connection<PromoEnrollmentRequestDocument>> => {
  return selectAllPromoEnrollmentRequestsUseCase({ info: { ...args } });
};

const promoEnrollmentRequest = async (
  parent: null,
  args: {
    id: string;
  },
): Promise<PromoEnrollmentRequestDocument> => {
  return selectOnePromoEnrollmentRequestUseCase({
    id: args.id,
  });
};

const processPromoEnrollmentRequest = async (
  parent: null,
  args: {
    id: string;
  },
): Promise<boolean> => {
  return processEnrollmentRequestUseCase({
    id: args.id,
  });
};

const approvePromoEnrollmentRequest = async (
  parent: null,
  args: {
    id: string;
  },
): Promise<boolean> => {
  return approveEnrollmentRequestUseCase({
    id: args.id,
  });
};

const rejectPromoEnrollmentRequest = async (
  parent: null,
  args: {
    id: string;
  },
): Promise<boolean> => {
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

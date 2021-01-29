import {
  PromoTemplate,
  Promo,
  PromoDocument,
} from '@lib/mongoose/models/promo';
import { MemberDocument } from '@lib/mongoose/models/member';
import { PromoEnrollmentRequest } from '@lib/mongoose/models/promo-enrollment-request';

import { selectOneMemberUseCase } from '@use-cases/members';
import { selectOnePromoUseCase } from '@use-cases/promos';
import {
  members,
  member,
  createMember,
  updateMember,
  deleteMember,
} from './members';

import {
  vendors,
  vendor,
  createVendor,
  updateVendor,
  deleteVendor,
} from './vendors';

import { createPromo, promos, promo, updatePromo, deletePromo } from './promos';
import {
  enrollToPromo,
  promoEnrollmentRequests,
  promoEnrollmentRequest,
  processPromoEnrollmentRequest,
  rejectPromoEnrollmentRequest,
  approvePromoEnrollmentRequest,
} from './promo-enrollments';

const Query = {
  members,
  member,
  vendors,
  vendor,
  promos,
  promo,
  promoEnrollmentRequests,
  promoEnrollmentRequest,
};
const Mutation = {
  createMember,
  updateMember,
  deleteMember,
  createVendor,
  updateVendor,
  deleteVendor,
  createPromo,
  updatePromo,
  deletePromo,
  enrollToPromo,
  processPromoEnrollmentRequest,
  rejectPromoEnrollmentRequest,
  approvePromoEnrollmentRequest,
};

export default {
  Query,
  Mutation,
  Promo: {
    __resolveType(parent: Promo): string {
      if (parent.template === PromoTemplate.Deposit) {
        return 'DepositPromo';
      }
      return 'SignUpPromo';
    },
  },
  PromoEnrollmentRequest: {
    async member(parent: PromoEnrollmentRequest): Promise<MemberDocument> {
      return selectOneMemberUseCase({
        id: parent.member,
      });
    },

    async promo(parent: PromoEnrollmentRequest): Promise<PromoDocument> {
      return selectOnePromoUseCase({
        id: parent.promo,
      });
    },
  },
};

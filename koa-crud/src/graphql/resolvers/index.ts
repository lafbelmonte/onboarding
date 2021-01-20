import { PromoTemplate, Promo } from '../../types';

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
};

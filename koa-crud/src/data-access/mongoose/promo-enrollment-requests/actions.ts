import { FilterQuery } from 'mongoose';
import PromoEnrollmentRequestModelType, {
  PromoEnrollmentRequest,
  PromoEnrollmentRequestDocument,
} from '@lib/mongoose/models/promo-enrollment-request';

import { paginateDbLayer } from '@pagination/index';

import { Connection } from '@types';

type PromoEnrollmentRequestFilters = FilterQuery<
  Partial<Pick<PromoEnrollmentRequest, '_id' | 'promo' | 'member'>>
>;

export type PromoEnrollmentRequestStore = {
  insertPromoEnrollment: (info: {
    promo: string;
    member: string;
  }) => Promise<PromoEnrollmentRequestDocument>;
  promoEnrollmentExistsByFilter: (
    filters: PromoEnrollmentRequestFilters,
  ) => Promise<boolean>;
  selectOnePromoEnrollmentByFilters: (
    filters: PromoEnrollmentRequestFilters,
  ) => Promise<PromoEnrollmentRequestDocument>;
  selectAllPromoEnrollmentRequests: () => Promise<
    PromoEnrollmentRequestDocument[]
  >;
  updatePromoEnrollmentRequestStatusByFilters: (
    filters: PromoEnrollmentRequestFilters,
    info: { status: PromoEnrollmentRequest['status'] },
  ) => Promise<PromoEnrollmentRequestDocument>;
  paginatedPromoEnrollmentRequests: (
    info,
  ) => Promise<Connection<PromoEnrollmentRequestDocument>>;
};

export default ({
  PromoEnrollmentRequestModel,
}: {
  PromoEnrollmentRequestModel: typeof PromoEnrollmentRequestModelType;
}): PromoEnrollmentRequestStore => {
  async function paginatedPromoEnrollmentRequests(info) {
    return paginateDbLayer<PromoEnrollmentRequestDocument>({
      model: PromoEnrollmentRequestModel,
      ...info,
    });
  }

  async function insertPromoEnrollment(info) {
    return PromoEnrollmentRequestModel.create(info);
  }

  async function promoEnrollmentExistsByFilter(filters) {
    return PromoEnrollmentRequestModel.exists(filters);
  }

  async function selectOnePromoEnrollmentByFilters(filters) {
    return PromoEnrollmentRequestModel.findOne(filters).lean({
      virtuals: true,
    });
  }

  async function selectAllPromoEnrollmentRequests() {
    return PromoEnrollmentRequestModel.find().lean({ virtuals: true });
  }

  async function updatePromoEnrollmentRequestStatusByFilters(filters, info) {
    return PromoEnrollmentRequestModel.findOneAndUpdate(filters, info, {
      new: true,
    });
  }

  return {
    insertPromoEnrollment,
    promoEnrollmentExistsByFilter,
    selectOnePromoEnrollmentByFilters,
    selectAllPromoEnrollmentRequests,
    updatePromoEnrollmentRequestStatusByFilters,
    paginatedPromoEnrollmentRequests,
  };
};

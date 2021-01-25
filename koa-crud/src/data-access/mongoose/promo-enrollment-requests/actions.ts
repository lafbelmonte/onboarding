import { PromoEnrollmentRequest as PromoEnrollmentRequestModel } from '../../../lib/mongoose/models/promo-enrollment-request';
import { PromoEnrollmentRequestsStore } from '../../../types/index';

const actions = ({
  PromoEnrollmentRequest,
}: {
  PromoEnrollmentRequest: typeof PromoEnrollmentRequestModel;
}): PromoEnrollmentRequestsStore => {
  async function insertPromoEnrollment(info) {
    return PromoEnrollmentRequest.create(info);
  }

  async function promoEnrollmentExistsByFilter(filters) {
    return PromoEnrollmentRequest.exists(filters);
  }

  async function selectOnePromoEnrollmentByFilters(filters) {
    return PromoEnrollmentRequest.findOne(filters).lean({ virtuals: true });
  }

  async function selectAllPromoEnrollmentRequests() {
    return PromoEnrollmentRequest.find().lean({ virtuals: true });
  }

  async function updatePromoEnrollmentRequestStatusByFilters(filters, info) {
    return PromoEnrollmentRequest.findOneAndUpdate(filters, info, {
      new: true,
    });
  }

  return {
    insertPromoEnrollment,
    promoEnrollmentExistsByFilter,
    selectOnePromoEnrollmentByFilters,
    selectAllPromoEnrollmentRequests,
    updatePromoEnrollmentRequestStatusByFilters,
  };
};

export default actions;

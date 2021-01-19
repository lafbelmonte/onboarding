import {
  UseCase,
  PromoEnrollmentRequestsStore,
  PromoEnrollmentRequestDocument,
} from '../../types';

const selectOnePromoEnrollmentRequest = ({
  promoEnrollmentRequestsStore,
}: {
  promoEnrollmentRequestsStore: PromoEnrollmentRequestsStore;
}): UseCase<PromoEnrollmentRequestDocument> => {
  return async function useCase({ id }) {
    const promoEnrollmentRequest = await promoEnrollmentRequestsStore.selectOnePromoEnrollmentByFilters(
      { _id: id },
    );

    if (!promoEnrollmentRequest) {
      throw new Error(`Promo enrollment not found`);
    }
    return promoEnrollmentRequest;
  };
};

export default selectOnePromoEnrollmentRequest;

import {
  UseCase,
  PromoEnrollmentRequestsStore,
  PromoEnrollmentRequestDocument,
} from '../../types';
import { PromoEnrollmentRequestNotFoundError } from '../../custom-errors';

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
      throw new PromoEnrollmentRequestNotFoundError(
        `Promo enrollment request with ID: ${id} doesn't exists`,
      );
    }
    return promoEnrollmentRequest;
  };
};

export default selectOnePromoEnrollmentRequest;

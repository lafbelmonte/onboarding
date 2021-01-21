import {
  UseCase,
  PromoEnrollmentRequestsStore,
  PromoEnrollmentRequestStatus,
} from '../../types';
import { PromoEnrollmentRequestNotFoundError } from '../../custom-errors';

const processEnrollmentRequest = ({
  promoEnrollmentRequestsStore,
}: {
  promoEnrollmentRequestsStore: PromoEnrollmentRequestsStore;
}): UseCase<boolean> => {
  return async function ({ id }) {
    const promoEnrollmentExists = await promoEnrollmentRequestsStore.promoEnrollmentExistsByFilter(
      { _id: id },
    );

    if (!promoEnrollmentExists) {
      throw new PromoEnrollmentRequestNotFoundError(
        `Promo enrollment request with ID: ${id} doesn't exists`,
      );
    }

    await promoEnrollmentRequestsStore.updatePromoEnrollmentRequestStatusByFilters(
      { _id: id },
      { status: PromoEnrollmentRequestStatus.Processing },
    );

    return true;
  };
};

export default processEnrollmentRequest;

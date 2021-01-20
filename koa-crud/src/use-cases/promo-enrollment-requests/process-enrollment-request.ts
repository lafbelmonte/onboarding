import {
  UseCase,
  PromoEnrollmentRequestsStore,
  PromoEnrollmentRequestStatus,
} from '../../types';

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
      throw new Error(`Promo with the given ID not found`);
    }

    await promoEnrollmentRequestsStore.updatePromoEnrollmentRequestStatusByFilters(
      { _id: id },
      { status: PromoEnrollmentRequestStatus.Processing },
    );

    return true;
  };
};

export default processEnrollmentRequest;

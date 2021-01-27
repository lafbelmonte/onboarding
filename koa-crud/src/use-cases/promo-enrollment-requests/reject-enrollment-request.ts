import { PromoEnrollmentRequestStore } from '../../data-access/mongoose/promo-enrollment-requests/actions';
import { PromoEnrollmentRequestStatus } from '../../lib/mongoose/models/promo-enrollment-request';
import { PromoEnrollmentRequestNotFoundError } from '../../custom-errors';

type Input = {
  id: string;
  info?;
  source?;
};

type Output = boolean;

export type RejectEnrollmentRequestUseCase = (input: Input) => Promise<Output>;

const rejectEnrollmentRequest = ({
  promoEnrollmentRequestStore,
}: {
  promoEnrollmentRequestStore: PromoEnrollmentRequestStore;
}): RejectEnrollmentRequestUseCase => {
  return async function ({ id }) {
    const promoEnrollmentExists = await promoEnrollmentRequestStore.promoEnrollmentExistsByFilter(
      { _id: id },
    );

    if (!promoEnrollmentExists) {
      throw new PromoEnrollmentRequestNotFoundError(
        `Promo enrollment request with ID: ${id} doesn't exists`,
      );
    }

    await promoEnrollmentRequestStore.updatePromoEnrollmentRequestStatusByFilters(
      { _id: id },
      { status: PromoEnrollmentRequestStatus.Rejected },
    );

    return true;
  };
};

export default rejectEnrollmentRequest;

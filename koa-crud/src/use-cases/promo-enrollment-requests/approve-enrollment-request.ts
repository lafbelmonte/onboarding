import { PromoEnrollmentRequestStore } from '../../data-access/mongoose/promo-enrollment-requests/actions';
import { PromoEnrollmentRequestStatus } from '../../lib/mongoose/models/promo-enrollment-request';
import { PromoEnrollmentRequestNotFoundError } from '../../custom-errors';

type Input = {
  id: string;
  info?;
  source?;
};

type Output = boolean;

export type ApproveEnrollmentRequestUseCase = (input: Input) => Promise<Output>;

const approveEnrollmentRequest = ({
  promoEnrollmentRequestStore,
}: {
  promoEnrollmentRequestStore: PromoEnrollmentRequestStore;
}): ApproveEnrollmentRequestUseCase => {
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
      { status: PromoEnrollmentRequestStatus.Approved },
    );

    return true;
  };
};

export default approveEnrollmentRequest;

import { PromoEnrollmentRequestStore } from '@data-access/mongoose/promo-enrollment-requests/actions';
import { PromoEnrollmentRequestStatus } from '@lib/mongoose/models/promo-enrollment-request';
import { PromoEnrollmentRequestNotFoundError } from '@custom-errors';
import { UseCase } from '@types';

type ApproveEnrollmentRequestUseCaseInput = {
  id: string;
  info?: null;
  source?: {
    ip: string;
    browser: string;
    referrer?: string;
  };
};

type ApproveEnrollmentRequestUseCaseOutput = boolean;

export type ApproveEnrollmentRequestUseCase = UseCase<
  ApproveEnrollmentRequestUseCaseInput,
  ApproveEnrollmentRequestUseCaseOutput
>;
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

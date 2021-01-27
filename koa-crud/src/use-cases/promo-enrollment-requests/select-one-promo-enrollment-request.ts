import { PromoEnrollmentRequestDocument } from '../../lib/mongoose/models/promo-enrollment-request';
import { PromoEnrollmentRequestStore } from '../../data-access/mongoose/promo-enrollment-requests/actions';
import { PromoEnrollmentRequestNotFoundError } from '../../custom-errors';
import { UseCase } from '../../types';

type SelectOnePromoEnrollmentRequestUseCaseInput = {
  id: string;
  info?: null;
  source?: {
    ip: string;
    browser: string;
    referrer?: string;
  };
};

type SelectOnePromoEnrollmentRequestUseCaseOutput = PromoEnrollmentRequestDocument;

export type SelectOnePromoEnrollmentRequestUseCase = UseCase<
  SelectOnePromoEnrollmentRequestUseCaseInput,
  SelectOnePromoEnrollmentRequestUseCaseOutput
>;
const selectOnePromoEnrollmentRequest = ({
  promoEnrollmentRequestStore,
}: {
  promoEnrollmentRequestStore: PromoEnrollmentRequestStore;
}): SelectOnePromoEnrollmentRequestUseCase => {
  return async function useCase({ id }) {
    const promoEnrollmentRequest = await promoEnrollmentRequestStore.selectOnePromoEnrollmentByFilters(
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

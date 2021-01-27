import { PromoEnrollmentRequestDocument } from '../../lib/mongoose/models/promo-enrollment-request';
import { PromoEnrollmentRequestStore } from '../../data-access/mongoose/promo-enrollment-requests/actions';
import { UseCase } from '../../types';

type SelectAllPromoEnrollmentRequestUseCaseInput = {
  id?: string;
  info?: null;
  source?: {
    ip: string;
    browser: string;
    referrer?: string;
  };
};

type SelectAllPromoEnrollmentRequestUseCaseOutput = PromoEnrollmentRequestDocument[];

export type SelectAllPromoEnrollmentRequestUseCase = UseCase<
  SelectAllPromoEnrollmentRequestUseCaseInput,
  SelectAllPromoEnrollmentRequestUseCaseOutput
>;

const selectAllPromoEnrollmentRequests = ({
  promoEnrollmentRequestStore,
}: {
  promoEnrollmentRequestStore: PromoEnrollmentRequestStore;
}): SelectAllPromoEnrollmentRequestUseCase => {
  return async function useCase() {
    const promoEnrollmentRequests = await promoEnrollmentRequestStore.selectAllPromoEnrollmentRequests();
    return promoEnrollmentRequests;
  };
};

export default selectAllPromoEnrollmentRequests;

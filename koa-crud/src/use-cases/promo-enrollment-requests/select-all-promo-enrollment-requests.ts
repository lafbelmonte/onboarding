import { PromoEnrollmentRequestDocument } from '@lib/mongoose/models/promo-enrollment-request';
import { PromoEnrollmentRequestStore } from '@data-access/mongoose/promo-enrollment-requests/actions';
import { UseCase, Connection } from '@types';

type SelectAllPromoEnrollmentRequestUseCaseInput = {
  id?: string;
  info?: {
    first: number;
    after: string;
  };
  source?: {
    ip: string;
    browser: string;
    referrer?: string;
  };
};

type SelectAllPromoEnrollmentRequestUseCaseOutput = Connection<PromoEnrollmentRequestDocument>;

export type SelectAllPromoEnrollmentRequestUseCase = UseCase<
  SelectAllPromoEnrollmentRequestUseCaseInput,
  SelectAllPromoEnrollmentRequestUseCaseOutput
>;

const selectAllPromoEnrollmentRequests = ({
  promoEnrollmentRequestStore,
}: {
  promoEnrollmentRequestStore: PromoEnrollmentRequestStore;
}): SelectAllPromoEnrollmentRequestUseCase => {
  return async function useCase({ info }) {
    const promoEnrollmentRequests = await promoEnrollmentRequestStore.paginatedPromoEnrollmentRequests(
      info,
    );
    return promoEnrollmentRequests;
  };
};

export default selectAllPromoEnrollmentRequests;

import { PromoEnrollmentRequestDocument } from '../../lib/mongoose/models/promo-enrollment-request';
import { PromoEnrollmentRequestStore } from '../../data-access/mongoose/promo-enrollment-requests/actions';

type Input = {
  id?: string;
  info?;
  source?;
};

type Output = PromoEnrollmentRequestDocument[];

export type SelectAllPromoEnrollmentRequestUseCase = (
  input: Input,
) => Promise<Output>;

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

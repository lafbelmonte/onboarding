import { PromoEnrollmentRequestDocument } from '../../lib/mongoose/models/promo-enrollment-request';
import { PromoEnrollmentRequestStore } from '../../data-access/mongoose/promo-enrollment-requests/actions';
import { PromoEnrollmentRequestNotFoundError } from '../../custom-errors';

type Input = {
  id: string;
  info?;
  source?;
};

type Output = PromoEnrollmentRequestDocument;

export type SelectOnePromoEnrollmentRequestUseCase = (
  input: Input,
) => Promise<Output>;

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

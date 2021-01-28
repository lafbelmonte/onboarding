import { PromoDocument } from '@lib/mongoose/models/promo';
import { PromoStore } from '@data-access/mongoose/promos/actions';
import { PromoNotFoundError } from '@custom-errors';
import { UseCase } from '@types';

type SelectOnePromoUseCaseInput = {
  id: string;
  info?: null;
  source?: {
    ip: string;
    browser: string;
    referrer?: string;
  };
};

type SelectOnePromoUseCaseOutput = PromoDocument;

export type SelectOnePromoUseCase = UseCase<
  SelectOnePromoUseCaseInput,
  SelectOnePromoUseCaseOutput
>;

const selectOnePromo = ({
  promoStore,
}: {
  promoStore: PromoStore;
}): SelectOnePromoUseCase => {
  return async function useCase({ id }) {
    const promo = await promoStore.selectOnePromoByFilters({ _id: id });

    if (!promo) {
      throw new PromoNotFoundError(`Promo with ID: ${id} doesn't exists`);
    }
    return promo;
  };
};

export default selectOnePromo;

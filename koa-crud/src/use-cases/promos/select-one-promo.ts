import { PromoDocument } from '../../lib/mongoose/models/promo';
import { PromoStore } from '../../data-access/mongoose/promos/actions';
import { PromoNotFoundError } from '../../custom-errors';

type Input = {
  id: string;
  info?;
  source?;
};

type Output = PromoDocument;

export type SelectOnePromoUseCase = (input: Input) => Promise<Output>;

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

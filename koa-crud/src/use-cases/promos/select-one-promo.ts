import { UseCase, PromoDocument, PromosStore } from '../../types';
import { PromoNotFoundError } from '../../custom-errors';
const selectOnePromo = ({
  promosStore,
}: {
  promosStore: PromosStore;
}): UseCase<PromoDocument> => {
  return async function useCase({ id }) {
    const promo = await promosStore.selectOnePromoByFilters({ _id: id });

    if (!promo) {
      throw new PromoNotFoundError(`Promo with ID: ${id} doesn't exists`);
    }
    return promo;
  };
};

export default selectOnePromo;

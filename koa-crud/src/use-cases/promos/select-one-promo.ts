import { UseCase, PromoDocument, PromosStore } from '../../types';

const selectOnePromo = ({
  promosStore,
}: {
  promosStore: PromosStore;
}): UseCase<PromoDocument> => {
  return async function useCase({ id }) {
    const promo = await promosStore.selectOnePromoByFilters({ _id: id });

    if (!promo) {
      throw new Error(`Promo not found`);
    }
    return promo;
  };
};

export default selectOnePromo;

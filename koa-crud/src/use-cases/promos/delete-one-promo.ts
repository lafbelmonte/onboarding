import { UseCase, PromosStore, PromoStatus } from '../../types';
import { PromoNotFoundError, ActivePromoError } from '../../custom-errors';
const deleteOnePromo = ({
  promosStore,
}: {
  promosStore: PromosStore;
}): UseCase<boolean> => {
  return async function useCase({ id }) {
    const promo = await promosStore.selectOnePromoByFilters({ _id: id });

    if (!promo) {
      throw new PromoNotFoundError(`Promo with ID: ${id} doesn't exists`);
    }

    if (promo.status === PromoStatus.Active) {
      throw new ActivePromoError(`Active promos can't be deleted`);
    }

    await promosStore.deleteOnePromo({ _id: id });

    return true;
  };
};

export default deleteOnePromo;

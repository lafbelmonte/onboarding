import { UseCase, PromosStore } from '../../types';
import { PromoNotFoundError } from '../../custom-errors';

const updatePromo = ({
  promoEntity,
  promosStore,
  R,
}: {
  promosStore: PromosStore;
  promoEntity;
  R;
}): UseCase<boolean> => {
  return async function ({ id, info }) {
    const promoExists = await promosStore.promoExistsByFilter({
      _id: id,
    });

    if (!promoExists) {
      throw new PromoNotFoundError(`Promo with ID: ${id} doesn't exists`);
    }

    const promo = await promoEntity(info);

    const truthlyPromo = R.filter(Boolean)(promo);

    await promosStore.updatePromoByFilters({ _id: id }, truthlyPromo);

    return true;
  };
};

export default updatePromo;

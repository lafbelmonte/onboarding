import { PromoStore } from '../../data-access/mongoose/promos/actions';
import { PromoStatus } from '../../lib/mongoose/models/promo';

import { PromoNotFoundError, ActivePromoError } from '../../custom-errors';

type Input = {
  id: string;
  info?;
  source?;
};

type Output = boolean;

export type DeleteOnePromoUseCase = (input: Input) => Promise<Output>;

const deleteOnePromo = ({
  promoStore,
}: {
  promoStore: PromoStore;
}): DeleteOnePromoUseCase => {
  return async function useCase({ id }) {
    const promo = await promoStore.selectOnePromoByFilters({ _id: id });

    if (!promo) {
      throw new PromoNotFoundError(`Promo with ID: ${id} doesn't exists`);
    }

    if (promo.status === PromoStatus.Active) {
      throw new ActivePromoError(`Active promos can't be deleted`);
    }

    await promoStore.deleteOnePromo({ _id: id });

    return true;
  };
};

export default deleteOnePromo;

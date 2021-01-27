import { PromoStore } from '../../data-access/mongoose/promos/actions';
import { PromoStatus } from '../../lib/mongoose/models/promo';

import { PromoNotFoundError, ActivePromoError } from '../../custom-errors';
import { UseCase } from '../../types';

type DeleteOnePromoUseCaseInput = {
  id: string;
  info?: null;
  source?: {
    ip: string;
    browser: string;
    referrer?: string;
  };
};

type DeleteOnePromoUseCaseOutput = boolean;

export type DeleteOnePromoUseCase = UseCase<
  DeleteOnePromoUseCaseInput,
  DeleteOnePromoUseCaseOutput
>;

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

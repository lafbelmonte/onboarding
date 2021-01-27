import { PromoNotFoundError } from '../../custom-errors';
import { PromoEntity } from '../../entities/promo/entity';
import { Promo } from '../../lib/mongoose/models/promo';
import { PromoStore } from '../../data-access/mongoose/promos/actions';
import { UseCase } from '../../types';

type UpdatePromoUseCaseInput = {
  id: string;
  info: Omit<Promo, '_id' | 'cursor' | 'cursorBuffer'>;
  source?: {
    ip: string;
    browser: string;
    referrer?: string;
  };
};

type UpdatePromoUseCaseOutput = boolean;

export type UpdatePromoUseCase = UseCase<
  UpdatePromoUseCaseInput,
  UpdatePromoUseCaseOutput
>;

const updatePromo = ({
  promoEntity,
  promoStore,
  R,
}: {
  promoStore: PromoStore;
  promoEntity: PromoEntity;
  R;
}): UpdatePromoUseCase => {
  return async function ({ id, info }) {
    const promoExists = await promoStore.promoExistsByFilter({
      _id: id,
    });

    if (!promoExists) {
      throw new PromoNotFoundError(`Promo with ID: ${id} doesn't exists`);
    }

    const promo = await promoEntity(info);

    const truthlyPromo = R.filter(Boolean)(promo);

    await promoStore.updatePromoByFilters({ _id: id }, truthlyPromo);

    return true;
  };
};

export default updatePromo;

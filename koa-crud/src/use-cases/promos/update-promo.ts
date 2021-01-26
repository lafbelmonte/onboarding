import { PromoNotFoundError } from '../../custom-errors';
import { PromoEntity } from '../../entities/promo/entity';
import { Promo } from '../../lib/mongoose/models/promo';
import { PromoStore } from '../../data-access/mongoose/promos/actions';

type Input = {
  id: string;
  info: {
    name: Promo['name'];
    template: Promo['template'];
    title: Promo['title'];
    description: Promo['description'];
    status: Promo['status'];
    minimumBalance: Promo['minimumBalance'];
    requiredMemberFields: Promo['requiredMemberFields'];
    submitted: Promo['submitted'];
    enabled: Promo['enabled'];
  };
  source?;
};

type Output = boolean;

export type UpdatePromoUseCase = (input: Input) => Promise<Output>;

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

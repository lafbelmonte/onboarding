import { PromoStore } from '../../data-access/mongoose/promos/actions';
import { Promo } from '../../lib/mongoose/models/promo';
import { PromoEntity } from '../../entities/promo/entity';

type Input = {
  id?: string;
  info: Omit<Promo, '_id' | 'cursor' | 'cursorBuffer'>;
  source?;
};

type Output = boolean;

export type InsertPromoUseCase = (input: Input) => Promise<Output>;

const insertPromo = ({
  promoEntity,
  promoStore,
}: {
  promoStore: PromoStore;
  promoEntity: PromoEntity;
}): InsertPromoUseCase => {
  return async function ({ info }) {
    const promo = await promoEntity(info);
    await promoStore.insertOnePromo(promo);
    return true;
  };
};

export default insertPromo;

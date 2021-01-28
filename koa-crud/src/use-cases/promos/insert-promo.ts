import { PromoStore } from '@data-access/mongoose/promos/actions';
import { Promo } from '@lib/mongoose/models/promo';
import { PromoEntity } from '@entities/promo/entity';
import { UseCase } from '@types';

type InsertPromoUseCaseInput = {
  id?: string;
  info: Omit<Promo, '_id' | 'cursor' | 'cursorBuffer'>;
  source?: {
    ip: string;
    browser: string;
    referrer?: string;
  };
};

type InsertPromoUseCaseOutput = boolean;

export type InsertPromoUseCase = UseCase<
  InsertPromoUseCaseInput,
  InsertPromoUseCaseOutput
>;

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

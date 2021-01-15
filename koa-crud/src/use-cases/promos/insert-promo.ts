import { UseCase, PromosStore } from '../../types';

const insertPromo = ({
  promoEntity,
  promosStore,
}: {
  promosStore: PromosStore;
  promoEntity;
}): UseCase<boolean> => {
  return async function ({ info }) {
    const promo = await promoEntity(info);

    await promosStore.insertOnePromo(promo);

    return true;
  };
};

export default insertPromo;

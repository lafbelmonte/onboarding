import { PromosStore, PromoDocument, UseCase } from '../../types';

const selectAllPromos = ({
  promosStore,
}: {
  promosStore: PromosStore;
}): UseCase<PromoDocument[]> => {
  return async function useCase() {
    const promos = await promosStore.selectAllPromos();
    return promos;
  };
};

export default selectAllPromos;

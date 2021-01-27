import { PromoStore } from '../../data-access/mongoose/promos/actions';
import { PromoDocument } from '../../lib/mongoose/models/promo';

type Input = {
  id?: string;
  info?;
  source?;
};

type Output = PromoDocument[];

export type SelectAllMembersUseCase = (input: Input) => Promise<Output>;

const selectAllPromos = ({
  promoStore,
}: {
  promoStore: PromoStore;
}): SelectAllMembersUseCase => {
  return async function useCase() {
    const promos = await promoStore.selectAllPromos();
    return promos;
  };
};

export default selectAllPromos;

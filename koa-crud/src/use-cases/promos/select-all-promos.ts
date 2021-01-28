import { PromoStore } from '@data-access/mongoose/promos/actions';
import { PromoDocument } from '@lib/mongoose/models/promo';
import { UseCase } from '@types';

type SelectAllMembersUseCaseInput = {
  id?: string;
  info?: null;
  source?: {
    ip: string;
    browser: string;
    referrer?: string;
  };
};

type SelectAllMembersUseCaseOutput = PromoDocument[];

export type SelectAllMembersUseCase = UseCase<
  SelectAllMembersUseCaseInput,
  SelectAllMembersUseCaseOutput
>;

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

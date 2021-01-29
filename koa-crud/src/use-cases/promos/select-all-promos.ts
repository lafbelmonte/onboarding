import { PromoStore } from '@data-access/mongoose/promos/actions';
import { PromoDocument } from '@lib/mongoose/models/promo';
import { UseCase, Connection } from '@types';

type SelectAllMembersUseCaseInput = {
  id?: string;
  info?: {
    first: number;
    after: string;
  };
  source?: {
    ip: string;
    browser: string;
    referrer?: string;
  };
};

type SelectAllMembersUseCaseOutput = Connection<PromoDocument>;

export type SelectAllMembersUseCase = UseCase<
  SelectAllMembersUseCaseInput,
  SelectAllMembersUseCaseOutput
>;

const selectAllPromos = ({
  promoStore,
}: {
  promoStore: PromoStore;
}): SelectAllMembersUseCase => {
  return async function useCase({ info }) {
    const promos = await promoStore.paginatedPromos(info);
    return promos;
  };
};

export default selectAllPromos;

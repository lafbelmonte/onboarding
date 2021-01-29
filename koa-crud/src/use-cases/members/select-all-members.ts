import { MemberDocument } from '@lib/mongoose/models/member';
import { MemberStore } from '@data-access/mongoose/members/actions';
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

type SelectAllMembersUseCaseOutput = Connection<MemberDocument>;

export type SelectAllMembersUseCase = UseCase<
  SelectAllMembersUseCaseInput,
  SelectAllMembersUseCaseOutput
>;

const selectAllMembers = ({
  memberStore,
}: {
  memberStore: MemberStore;
}): SelectAllMembersUseCase => {
  return async function useCase({ info }) {
    const members = await memberStore.paginatedMembers(info);
    return members;
  };
};

export default selectAllMembers;

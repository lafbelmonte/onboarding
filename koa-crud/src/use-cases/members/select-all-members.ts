import { MemberDocument } from '../../lib/mongoose/models/member';
import { MemberStore } from '../../data-access/mongoose/members/actions';
import { UseCase } from '../../types';

type SelectAllMembersUseCaseInput = {
  id?: string;
  info?: null;
  source?: {
    ip: string;
    browser: string;
    referrer?: string;
  };
};

type SelectAllMembersUseCaseOutput = MemberDocument[];

export type SelectAllMembersUseCase = UseCase<
  SelectAllMembersUseCaseInput,
  SelectAllMembersUseCaseOutput
>;

const selectAllMembers = ({
  memberStore,
}: {
  memberStore: MemberStore;
}): SelectAllMembersUseCase => {
  return async function useCase() {
    const members = await memberStore.selectAllMembers();
    return members;
  };
};

export default selectAllMembers;

import { MemberDocument } from '../../lib/mongoose/models/member';
import { MemberStore } from '../../data-access/mongoose/members/actions';

type Input = {
  id?: string;
  info?;
  source?;
};

type Output = MemberDocument[];

export type SelectAllMembersUseCase = (input: Input) => Promise<Output>;

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

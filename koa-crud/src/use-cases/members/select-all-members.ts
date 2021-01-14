import { UseCase, MembersStore, MemberDocument } from '../../types';

const selectAllMembers = ({
  membersStore,
}: {
  membersStore: MembersStore;
}): UseCase<MemberDocument[]> => {
  return async function useCase() {
    const members = await membersStore.selectAllMembers();
    return members;
  };
};

export default selectAllMembers;

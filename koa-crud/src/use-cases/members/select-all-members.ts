import { UseCase, MembersStore } from '../../types';

const selectAllMembers = ({
  membersStore,
}: {
  membersStore: MembersStore;
}): UseCase => {
  return async function useCase() {
    const members = await membersStore.selectAllMembers();
    return members;
  };
};

export default selectAllMembers;

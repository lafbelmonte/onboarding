import { UseCase, MembersStore } from '../../types';

const selectOneMember = ({
  membersStore,
}: {
  membersStore: MembersStore;
}): UseCase => {
  return async function useCase({ id }) {
    const memberExists = await membersStore.memberExistsByFilter({
      _id: id,
    });

    if (!memberExists) {
      throw new Error(`Member doesn't exist`);
    }

    const member = await membersStore.selectOneMemberByFilters({ _id: id });

    return member;
  };
};

export default selectOneMember;

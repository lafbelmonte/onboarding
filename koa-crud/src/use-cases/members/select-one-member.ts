import { UseCase, MembersStore, MemberDocument } from '../../types';
import { MemberNotFoundError } from '../../custom-errors';
const selectOneMember = ({
  membersStore,
}: {
  membersStore: MembersStore;
}): UseCase<MemberDocument> => {
  return async function useCase({ id }) {
    const memberExists = await membersStore.memberExistsByFilter({
      _id: id,
    });

    if (!memberExists) {
      throw new MemberNotFoundError(`Member with ID: ${id} doesn't exists`);
    }

    const member = await membersStore.selectOneMemberByFilters({ _id: id });

    return member;
  };
};

export default selectOneMember;

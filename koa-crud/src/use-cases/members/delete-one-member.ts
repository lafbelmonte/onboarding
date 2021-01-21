import { UseCase, MembersStore } from '../../types';
import { MemberNotFoundError } from '../../custom-errors';
const deleteOneMember = ({
  membersStore,
}: {
  membersStore: MembersStore;
}): UseCase<boolean> => {
  return async function useCase({ id }) {
    const memberExists = await membersStore.memberExistsByFilter({
      _id: id,
    });

    if (!memberExists) {
      throw new MemberNotFoundError(`Member with ID: ${id} doesn't exists`);
    }

    await membersStore.deleteOneMember({ _id: id });

    return true;
  };
};

export default deleteOneMember;

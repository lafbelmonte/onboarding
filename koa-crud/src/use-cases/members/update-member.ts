import { UseCase, MembersStore } from '../../types';
import { MemberNotFoundError, ExistingMemberError } from '../../custom-errors';

const updateMember = ({
  memberEntity,
  membersStore,
  R,
}: {
  membersStore: MembersStore;
  memberEntity;
  R;
}): UseCase<boolean> => {
  return async function ({ id, info }) {
    const memberExists = await membersStore.memberExistsByFilter({
      _id: id,
    });

    if (!memberExists) {
      throw new MemberNotFoundError(`Member with ID: ${id} doesn't exists`);
    }

    const member = await memberEntity(info);

    const usernameExists = await membersStore.selectOneMemberByFilters({
      username: member.username,
      _id: { $ne: id },
    });

    if (usernameExists) {
      throw new ExistingMemberError(
        `Username: ${member.username} already exists`,
      );
    }

    await membersStore.updateMemberByFilters(
      { _id: id },
      R.omit(['password'], member),
    );

    return true;
  };
};

export default updateMember;

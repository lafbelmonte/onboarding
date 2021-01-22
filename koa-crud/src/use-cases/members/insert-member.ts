import { UseCase, MembersStore } from '../../types';
import {
  MissingMemberInformationError,
  ExistingMemberError,
} from '../../custom-errors';

const insertMember = ({
  memberEntity,
  membersStore,
}: {
  memberEntity;
  membersStore: MembersStore;
}): UseCase<boolean> => {
  return async function ({ info }) {
    if (!info.password) {
      throw new MissingMemberInformationError(`Please input password`);
    }

    const member = await memberEntity(info);

    const usernameExists = await membersStore.memberExistsByFilter({
      username: member.username,
    });

    if (usernameExists) {
      throw new ExistingMemberError(
        `Username: ${member.username} already exists`,
      );
    }

    await membersStore.insertOneMember(member);

    return true;
  };
};

export default insertMember;

import { UseCase, MembersStore } from '../../types';

const insertMember = ({
  memberEntity,
  membersStore,
}: {
  memberEntity;
  membersStore: MembersStore;
}): UseCase<boolean> => {
  return async function ({ info }) {
    if (!info.password) {
      throw new Error(`Please input password`);
    }

    const member = await memberEntity(info);

    const usernameExists = await membersStore.memberExistsByFilter({
      username: member.username,
    });

    if (usernameExists) {
      throw new Error(`Username already exists`);
    }

    await membersStore.insertOneMember(member);

    return true;
  };
};

export default insertMember;

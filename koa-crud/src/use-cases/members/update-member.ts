import { Member } from '../../lib/mongoose/models/member';
import { MemberStore } from '../../data-access/mongoose/members/actions';
import { MemberNotFoundError, ExistingMemberError } from '../../custom-errors';
import { MemberEntity } from '../../entities/member/entity';

type Input = {
  id: string;
  info: {
    username: Member[`username`];
    realName?: Member[`realName`];
    email?: Member[`email`];
    bankAccount?: Member[`bankAccount`];
    balance?: Member[`balance`];
  };
  source?;
};

type Output = boolean;

export type UpdateMemberUseCase = (input: Input) => Promise<Output>;

const updateMember = ({
  memberEntity,
  memberStore,
  R,
}: {
  memberStore: MemberStore;
  memberEntity: MemberEntity;
  R;
}): UpdateMemberUseCase => {
  return async function ({ id, info }) {
    const memberExists = await memberStore.memberExistsByFilter({
      _id: id,
    });

    if (!memberExists) {
      throw new MemberNotFoundError(`Member with ID: ${id} doesn't exists`);
    }

    const member = await memberEntity(info);

    const usernameExists = await memberStore.selectOneMemberByFilters({
      username: member.username,
      _id: { $ne: id },
    });

    if (usernameExists) {
      throw new ExistingMemberError(
        `Username: ${member.username} already exists`,
      );
    }

    await memberStore.updateMemberByFilters(
      { _id: id },
      R.omit(['password'], member),
    );

    return true;
  };
};

export default updateMember;

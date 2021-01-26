import { Member } from '../../lib/mongoose/models/member';
import { MemberStore } from '../../data-access/mongoose/members/actions';
import {
  MissingMemberInformationError,
  ExistingMemberError,
} from '../../custom-errors';
import { MemberEntity } from '../../entities/member/entity';

type Input = {
  id?: string;
  info: {
    username: Member[`username`];
    password: Member[`password`];
    realName?: Member[`realName`];
    email?: Member[`email`];
    bankAccount?: Member[`bankAccount`];
    balance?: Member[`balance`];
  };
  source?;
};

type Output = boolean;

export type InsertMemberUseCase = (input: Input) => Promise<Output>;

const insertMember = ({
  memberEntity,
  memberStore,
}: {
  memberEntity: MemberEntity;
  memberStore: MemberStore;
}): InsertMemberUseCase => {
  return async function ({ info }) {
    if (!info.password) {
      throw new MissingMemberInformationError(`Please input password`);
    }

    const member = await memberEntity(info);

    const usernameExists = await memberStore.memberExistsByFilter({
      username: member.username,
    });

    if (usernameExists) {
      throw new ExistingMemberError(
        `Username: ${member.username} already exists`,
      );
    }

    await memberStore.insertOneMember(member);

    return true;
  };
};

export default insertMember;

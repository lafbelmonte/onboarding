import { Member } from '../../lib/mongoose/models/member';
import { MemberStore } from '../../data-access/mongoose/members/actions';
import {
  MissingMemberInformationError,
  ExistingMemberError,
} from '../../custom-errors';
import { MemberEntity } from '../../entities/member/entity';

type InsertMemberUseCaseInput = {
  id?: string;
  info: {
    username: Member[`username`];
    password: Member[`password`];
  } & Partial<Pick<Member, 'realName' | 'email' | 'bankAccount' | 'balance'>>;
  source?;
};

type InsertMemberUseCaseOutput = boolean;

export type InsertMemberUseCase = (
  input: InsertMemberUseCaseInput,
) => Promise<InsertMemberUseCaseOutput>;

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

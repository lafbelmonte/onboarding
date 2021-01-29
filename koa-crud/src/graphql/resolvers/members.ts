import {
  selectAllMembersUseCase,
  insertMemberUseCase,
  selectOneMemberUseCase,
  updateMemberUseCase,
  deleteOneMemberUseCase,
} from '@use-cases/members';

import { Member, MemberDocument } from '@lib/mongoose/models/member';

import { Connection } from '@types';

import { PaginateInput } from '@pagination/paginate-db-layer';

const members = async (
  parent: null,
  args: Omit<PaginateInput, 'model'>,
): Promise<Connection<MemberDocument>> => {
  return selectAllMembersUseCase({ info: { ...args } });
};

const member = async (
  parent: null,
  args: { id: string },
): Promise<MemberDocument> => {
  return selectOneMemberUseCase({ id: args.id });
};

const createMember = async (
  parent: null,
  args: {
    input: {
      username: Member[`username`];
      password: Member[`password`];
    } & Partial<Pick<Member, 'realName' | 'email' | 'bankAccount' | 'balance'>>;
  },
): Promise<boolean> => {
  return insertMemberUseCase({ info: args.input });
};

const updateMember = async (
  parent: null,
  args: {
    input: {
      id: string;
      username: Member[`username`];
    } & Partial<Pick<Member, 'realName' | 'email' | 'bankAccount' | 'balance'>>;
  },
): Promise<boolean> => {
  return updateMemberUseCase({
    id: args.input.id,
    info: args.input,
  });
};

const deleteMember = async (
  parent: null,
  args: { id: string },
): Promise<boolean> => {
  return deleteOneMemberUseCase({ id: args.id });
};

export { members, member, createMember, updateMember, deleteMember };

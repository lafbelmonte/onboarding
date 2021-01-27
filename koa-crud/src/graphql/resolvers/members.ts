import {
  selectAllMembersUseCase,
  insertMemberUseCase,
  selectOneMemberUseCase,
  updateMemberUseCase,
  deleteOneMemberUseCase,
} from '../../use-cases/members';

import { MemberDocument } from '../../lib/mongoose/models/member';
import { Connection } from '../../types';

import paginate from '../../pagination';

const members = async (
  obj,
  args: { first: number; after: string },
): Promise<Connection<MemberDocument>> => {
  const data = await selectAllMembersUseCase({});

  return paginate<MemberDocument>({
    data,
    first: args.first,
    after: args.after,
  });
};

const member = async (obj, args: { id: string }): Promise<MemberDocument> => {
  return selectOneMemberUseCase({ id: args.id });
};

const createMember = async (obj, args): Promise<boolean> => {
  return insertMemberUseCase({ info: args.input });
};

const updateMember = async (obj, args): Promise<boolean> => {
  return updateMemberUseCase({
    id: args.input.id,
    info: args.input,
  });
};

const deleteMember = async (obj, args): Promise<boolean> => {
  return deleteOneMemberUseCase({ id: args.id });
};

export { members, member, createMember, updateMember, deleteMember };

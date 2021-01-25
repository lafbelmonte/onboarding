import { MemberDocument, Member, Connection } from '../../types';
import {
  selectAllMembersUseCase,
  insertMemberUseCase,
  selectOneMemberUseCase,
  updateMemberUseCase,
  deleteOneMemberUseCase,
} from '../../use-cases/members';

import paginate from '../../pagination';

const members = async (obj, args): Promise<Connection<MemberDocument>> => {
  const data = await selectAllMembersUseCase({
    id: null,
    info: null,
    source: null,
  });

  return paginate<MemberDocument>({
    data,
    first: args.first,
    after: args.after,
  });
};

const member = async (obj, args: Member): Promise<MemberDocument> => {
  return selectOneMemberUseCase({ id: args.id, info: null, source: null });
};

const createMember = async (obj, args: { input: Member }): Promise<boolean> => {
  return insertMemberUseCase({ id: null, info: args.input, source: null });
};

const updateMember = async (obj, args: { input: Member }): Promise<boolean> => {
  return updateMemberUseCase({
    id: args.input.id,
    info: args.input,
    source: null,
  });
};

const deleteMember = async (obj, args: Member): Promise<boolean> => {
  return deleteOneMemberUseCase({ id: args.id, info: null, source: null });
};

export { members, member, createMember, updateMember, deleteMember };

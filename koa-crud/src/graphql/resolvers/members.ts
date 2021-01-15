import {
  selectAllMembersUseCase,
  insertMemberUseCase,
  selectOneMemberUseCase,
  updateMemberUseCase,
  deleteOneMemberUseCase,
} from '../../use-cases/members';

const members = async () =>
  selectAllMembersUseCase({ id: null, info: null, source: null });

const member = async (obj, args) =>
  selectOneMemberUseCase({ id: args.id, info: null, source: null });

const createMember = async (obj, args) =>
  insertMemberUseCase({ id: null, info: args.input, source: null });

const updateMember = async (obj, args) =>
  updateMemberUseCase({
    id: args.input.id,
    info: args.input,
    source: null,
  });

const deleteMember = async (obj, args) =>
  deleteOneMemberUseCase({ id: args.id, info: null, source: null });

export { members, member, createMember, updateMember, deleteMember };

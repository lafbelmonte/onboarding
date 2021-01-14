import {
  selectAllVendorsUseCase,
  insertVendorUseCase,
  selectOneVendorUseCase,
  updateVendorUseCase,
  deleteOneVendorUseCase,
} from '../use-cases/vendors';

import {
  selectAllMembersUseCase,
  insertMemberUseCase,
  selectOneMemberUseCase,
  updateMemberUseCase,
  deleteOneMemberUseCase,
} from '../use-cases/members';

const Query = {
  vendors: async (obj, args, ctx) => {
    if (!ctx.allowed) {
      throw new Error('Forbidden');
    }
    return selectAllVendorsUseCase({ id: null, info: null, source: null });
  },
  vendor: async (obj, args, ctx) => {
    if (!ctx.allowed) {
      throw new Error('Forbidden');
    }
    return selectOneVendorUseCase({ id: args.id, info: null, source: null });
  },
  members: async () =>
    selectAllMembersUseCase({ id: null, info: null, source: null }),
  member: async (obj, args) =>
    selectOneMemberUseCase({ id: args.id, info: null, source: null }),
};

const Mutation = {
  createVendor: async (obj, args, ctx) => {
    if (!ctx.allowed) {
      throw new Error('Forbidden');
    }

    return insertVendorUseCase({ id: null, info: args.input, source: null });
  },
  updateVendor: async (obj, args, ctx) => {
    if (!ctx.allowed) {
      throw new Error('Forbidden');
    }

    return updateVendorUseCase({
      id: args.input.id,
      info: args.input,
      source: null,
    });
  },
  deleteVendor: async (obj, args, ctx) => {
    if (!ctx.allowed) {
      throw new Error('Forbidden');
    }
    return deleteOneVendorUseCase({ id: args.id, info: null, source: null });
  },
  createMember: async (obj, args) =>
    insertMemberUseCase({ id: null, info: args.input, source: null }),
  updateMember: async (obj, args) =>
    updateMemberUseCase({
      id: args.input.id,
      info: args.input,
      source: null,
    }),
  deleteMember: async (obj, args) =>
    deleteOneMemberUseCase({ id: args.id, info: null, source: null }),
};

export default {
  Query,
  Mutation,
};

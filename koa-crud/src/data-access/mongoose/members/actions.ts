import { FilterQuery } from 'mongoose';
import MemberModelType, {
  Member,
  MemberDocument,
} from '@lib/mongoose/models/member';

import { paginateDbLayer } from '@pagination/index';

import { Connection } from '@types';

type MemberInformation = { password?: Member['password'] | null } & Partial<
  Pick<Member, 'username' | 'realName' | 'email' | 'bankAccount' | 'balance'>
>;

type MemberFilters = FilterQuery<Partial<Pick<Member, '_id' | 'username'>>>;

export type MemberStore = {
  insertOneMember: (info: MemberInformation) => Promise<MemberDocument>;
  memberExistsByFilter: (filters: MemberFilters) => Promise<boolean>;
  selectAllMembers: () => Promise<MemberDocument[]>;
  selectOneMemberByFilters: (filters: MemberFilters) => Promise<MemberDocument>;
  updateMemberByFilters: (
    filters: MemberFilters,
    info: MemberInformation,
  ) => Promise<MemberDocument>;
  deleteOneMember: (filters: MemberFilters) => Promise<boolean>;
  paginatedMembers: (info) => Promise<Connection<MemberDocument>>;
};

export default ({
  MemberModel,
}: {
  MemberModel: typeof MemberModelType;
}): MemberStore => {
  async function paginatedMembers(info) {
    return paginateDbLayer<MemberDocument>({
      model: MemberModel,
      ...info,
    });
  }

  async function insertOneMember(info) {
    return MemberModel.create(info);
  }

  async function memberExistsByFilter(filters) {
    return MemberModel.exists(filters);
  }

  async function selectAllMembers() {
    return MemberModel.find().lean({ virtuals: true });
  }

  async function selectOneMemberByFilters(filters) {
    return MemberModel.findOne(filters).lean({ virtuals: true });
  }

  async function updateMemberByFilters(filters, info) {
    return MemberModel.findOneAndUpdate(filters, info, {
      new: true,
    });
  }

  async function deleteOneMember(filters) {
    const vendor = await MemberModel.deleteOne(filters);

    const isDeleted = !!(vendor.ok === 1 && vendor.deletedCount === 1);

    return isDeleted;
  }

  return {
    insertOneMember,
    memberExistsByFilter,
    selectAllMembers,
    selectOneMemberByFilters,
    updateMemberByFilters,
    deleteOneMember,
    paginatedMembers,
  };
};

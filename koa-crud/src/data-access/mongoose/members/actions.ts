import MemberModelType, {
  Member,
  MemberDocument,
} from '../../../lib/mongoose/models/member';

type Information = {
  username?: Member['username'];
  password?: Member['password'];
  realName?: Member[`realName`];
  email?: Member[`email`];
  bankAccount?: Member[`bankAccount`];
  balance?: Member[`balance`];
};

type Filters = {
  _id?: string | Record<string, any>;
  username?: string | Record<string, any>;
};

export type MemberStore = {
  insertOneMember: (info: Information) => Promise<MemberDocument>;
  memberExistsByFilter: (filters: Filters) => Promise<boolean>;
  selectAllMembers: () => Promise<MemberDocument[]>;
  selectOneMemberByFilters: (filters: Filters) => Promise<MemberDocument>;
  updateMemberByFilters: (
    filters: Filters,
    info: Information,
  ) => Promise<MemberDocument>;
  deleteOneMember: (filters: Filters) => Promise<boolean>;
};

export default ({
  MemberModel,
}: {
  MemberModel: typeof MemberModelType;
}): MemberStore => {
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
  };
};

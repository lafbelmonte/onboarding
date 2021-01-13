import { MembersStore } from '../../../types/index';

const actions = ({ Member }): MembersStore => {
  async function insertOneMember(info) {
    return Member.create(info);
  }

  async function memberExistsByFilter(filters) {
    return Member.exists(filters);
  }

  async function selectAllMembers() {
    return Member.find().lean({ virtuals: true });
  }

  async function selectOneMemberByFilters(filters) {
    return Member.findOne(filters).lean({ virtuals: true });
  }

  async function updateMemberByFilters(filters, info) {
    return Member.findOneAndUpdate(filters, info, {
      new: true,
    });
  }

  return {
    insertOneMember,
    memberExistsByFilter,
    selectAllMembers,
    selectOneMemberByFilters,
    updateMemberByFilters,
  };
};

export default actions;

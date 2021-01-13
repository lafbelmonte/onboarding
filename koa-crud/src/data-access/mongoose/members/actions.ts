import { MembersStore } from '../../../types/index';

const actions = ({ Member }): MembersStore => {
  async function insertOneMember(info) {
    return Member.create(info);
  }

  async function memberExistsByFilter(filters) {
    return Member.exists(filters);
  }

  return {
    insertOneMember,
    memberExistsByFilter,
  };
};

export default actions;

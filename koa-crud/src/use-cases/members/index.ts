import { membersStore } from '../../data-access/mongoose/members';

import { memberEntity } from '../../entities/member';

import insertMember from './insert-member';
import selectAllMembers from './select-all-members';
import selectOneMember from './select-one-member';
import updateMember from './update-member';

const insertMemberUseCase = insertMember({ memberEntity, membersStore });
const selectAllMembersUseCase = selectAllMembers({ membersStore });
const selectOneMemberUseCase = selectOneMember({ membersStore });
const updateMemberUseCase = updateMember({ memberEntity, membersStore });

export {
  insertMemberUseCase,
  selectAllMembersUseCase,
  selectOneMemberUseCase,
  updateMemberUseCase,
};

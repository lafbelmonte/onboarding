import R from 'ramda';
import { membersStore } from '../../data-access/mongoose/members';

import { memberEntity } from '../../entities/member';

import insertMember from './insert-member';
import selectAllMembers from './select-all-members';
import selectOneMember from './select-one-member';
import updateMember from './update-member';
import deleteOneMember from './delete-one-member';

const insertMemberUseCase = insertMember({ memberEntity, membersStore });
const selectAllMembersUseCase = selectAllMembers({ membersStore });
const selectOneMemberUseCase = selectOneMember({ membersStore });
const updateMemberUseCase = updateMember({ memberEntity, membersStore, R });
const deleteOneMemberUseCase = deleteOneMember({ membersStore });

export {
  insertMemberUseCase,
  selectAllMembersUseCase,
  selectOneMemberUseCase,
  updateMemberUseCase,
  deleteOneMemberUseCase,
};

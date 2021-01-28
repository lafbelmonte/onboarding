import R from 'ramda';
import { memberStore } from '@data-access/mongoose/members';

import { memberEntity } from '@entities/member';

import insertMember from './insert-member';
import selectAllMembers from './select-all-members';
import selectOneMember from './select-one-member';
import updateMember from './update-member';
import deleteOneMember from './delete-one-member';

const insertMemberUseCase = insertMember({ memberEntity, memberStore });
const selectAllMembersUseCase = selectAllMembers({ memberStore });
const selectOneMemberUseCase = selectOneMember({ memberStore });
const updateMemberUseCase = updateMember({ memberEntity, memberStore, R });
const deleteOneMemberUseCase = deleteOneMember({ memberStore });

export {
  insertMemberUseCase,
  selectAllMembersUseCase,
  selectOneMemberUseCase,
  updateMemberUseCase,
  deleteOneMemberUseCase,
};

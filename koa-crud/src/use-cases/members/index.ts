import { membersStore } from '../../data-access/mongoose/members';

import { memberEntity } from '../../entities/member';

import insertMember from './insert-member';

const insertMemberUseCase = insertMember({ memberEntity, membersStore });

export { insertMemberUseCase };

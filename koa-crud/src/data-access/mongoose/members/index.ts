import MemberModel from '@lib/mongoose/models/member';

import actions from './actions';

const memberStore = actions({ MemberModel });

export { memberStore };

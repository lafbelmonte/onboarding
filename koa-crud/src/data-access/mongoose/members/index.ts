import { Member } from '../../../lib/mongoose/models/member';

import actions from './actions';

const membersStore = actions({ Member });

export { membersStore };

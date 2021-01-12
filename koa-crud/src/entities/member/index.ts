import bcrypt from 'bcrypt';

import entity from './entity';

const memberEntity = entity({ bcrypt });

export { memberEntity };

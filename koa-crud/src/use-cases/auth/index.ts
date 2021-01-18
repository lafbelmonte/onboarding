import bcrypt from 'bcrypt';
import authenticate from './authenticate';
import { membersStore } from '../../data-access/mongoose/members';
import { generateToken } from '../../lib/jwt';

const authenticateUseCase = authenticate({
  membersStore,
  bcrypt,
  generateToken,
});

export { authenticateUseCase };

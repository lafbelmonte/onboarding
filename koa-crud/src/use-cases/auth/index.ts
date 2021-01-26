import bcrypt from 'bcrypt';
import authenticate from './authenticate';
import { memberStore } from '../../data-access/mongoose/members';
import { generateToken } from '../../lib/jwt';

const authenticateUseCase = authenticate({
  memberStore,
  bcrypt,
  generateToken,
});

export { authenticateUseCase };

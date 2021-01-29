import bcrypt from 'bcrypt';
import { memberStore } from '@data-access/mongoose/members';
import { generateToken } from '@lib/jwt';
import authenticate from './authenticate';

const authenticateUseCase = authenticate({
  memberStore,
  bcrypt,
  generateToken,
});

export { authenticateUseCase };

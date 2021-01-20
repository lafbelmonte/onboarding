import bcryptType from 'bcrypt';
import { Member } from '../../types/index';

const entity = ({ bcrypt }: { bcrypt: typeof bcryptType }) => {
  return async function member({
    username,
    password,
    realName,
    email,
    bankAccount,
    balance,
  }: Member): Promise<Member> {
    if (!username) {
      throw new Error(`Please input username`);
    }

    return {
      username,
      password: password ? await bcrypt.hash(password, 10) : null,
      realName,
      email,
      bankAccount,
      balance,
    };
  };
};

export default entity;

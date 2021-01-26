import bcryptType from 'bcrypt';
import { Member } from '../../lib/mongoose/models/member';
import { MissingMemberInformationError } from '../../custom-errors';

type Input = {
  username: Member[`username`];
  password?: Member[`password`];
  realName?: Member[`realName`];
  email?: Member[`email`];
  bankAccount?: Member[`bankAccount`];
  balance?: Member[`balance`];
};

type Output = {
  username: Member[`username`];
  password?: Member[`password`];
  realName?: Member[`realName`];
  email?: Member[`email`];
  bankAccount?: Member[`bankAccount`];
  balance?: Member[`balance`];
};

export type MemberEntity = (input: Input) => Promise<Output>;

const entity = ({ bcrypt }: { bcrypt: typeof bcryptType }): MemberEntity => {
  return async function member({
    username,
    password,
    realName,
    email,
    bankAccount,
    balance,
  }) {
    if (!username) {
      throw new MissingMemberInformationError(`Please input username`);
    }

    return {
      username,
      password: password ? await bcrypt.hash(password, 10) : undefined,
      realName,
      email,
      bankAccount,
      balance,
    };
  };
};

export default entity;

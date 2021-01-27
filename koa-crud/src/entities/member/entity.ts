import bcryptType from 'bcrypt';
import { Member } from '../../lib/mongoose/models/member';
import { MissingMemberInformationError } from '../../custom-errors';
import { Entity } from '../../types';

type MemberEntityInput = { username: Member[`username`] } & Partial<
  Pick<Member, 'password' | 'realName' | 'email' | 'bankAccount' | 'balance'>
>;

type MemberEntityOutput = {
  username: Member[`username`];
  password: Member['password'] | null;
} & Partial<Pick<Member, 'realName' | 'email' | 'bankAccount' | 'balance'>>;

export type MemberEntity = Entity<MemberEntityInput, MemberEntityOutput>;

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
      password: password ? await bcrypt.hash(password, 10) : null,
      realName,
      email,
      bankAccount,
      balance,
    };
  };
};

export default entity;

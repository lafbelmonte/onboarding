import { Member } from '../../types/index';

const entity = ({ bcrypt }) => {
  return async function member({
    username,
    password,
    realName,
  }): Promise<Member> {
    if (!username) {
      throw new Error(`Please input username`);
    }

    if (!password) {
      throw new Error(`Please input password`);
    }

    return {
      username,
      password: await bcrypt.hash(password, 10),
      realName,
    };
  };
};

export default entity;

import { UseCase, MembersStore } from '../../types';

const authenticate = ({
  membersStore,
  bcrypt,
  jwt,
  generateToken,
}: {
  membersStore: MembersStore;
  bcrypt;
  jwt;
  generateToken;
}): UseCase<string> => {
  return async function ({ info }) {
    if (!info.username) {
      throw new Error(`Please input username`);
    }

    if (!info.password) {
      throw new Error(`Please input password`);
    }

    const usernameExists = await membersStore.selectOneMemberByFilters({
      username: info.username,
    });

    if (!usernameExists) {
      throw new Error(`Invalid credentials`);
    }

    const passwordMatch = await bcrypt.compare(
      info.password,
      usernameExists.password,
    );

    if (!passwordMatch) {
      throw new Error(`Invalid credentials`);
    }

    const token = generateToken(usernameExists._id);

    return token;
  };
};

export default authenticate;

import { UseCase, MembersStore } from '../../types';
import {
  MissingCredentialsError,
  InvalidCredentialsError,
} from '../../custom-errors';

const authenticate = ({
  membersStore,
  bcrypt,
  generateToken,
}: {
  membersStore: MembersStore;
  bcrypt;
  generateToken;
}): UseCase<string> => {
  return async function ({ info }) {
    if (!info.username) {
      throw new MissingCredentialsError(`Please input username`);
    }

    if (!info.password) {
      throw new MissingCredentialsError(`Please input password`);
    }

    const usernameExists = await membersStore.selectOneMemberByFilters({
      username: info.username,
    });

    if (!usernameExists) {
      throw new InvalidCredentialsError(
        `Username: ${info.username} doesn't exists`,
      );
    }

    const passwordMatch = await bcrypt.compare(
      info.password,
      usernameExists.password,
    );

    if (!passwordMatch) {
      throw new InvalidCredentialsError(`Incorrect password`);
    }

    const token = generateToken(usernameExists._id);

    return token;
  };
};

export default authenticate;

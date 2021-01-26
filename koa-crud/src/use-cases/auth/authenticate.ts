import { MemberStore } from '../../data-access/mongoose/members/actions';
import {
  MissingCredentialsError,
  InvalidCredentialsError,
} from '../../custom-errors';

type Input = {
  id?: string;
  info: {
    username: string;
    password: string;
  };
  source?;
};

type Output = string;

export type AuthenticateUseCase = (input: Input) => Promise<Output>;

const authenticate = ({
  memberStore,
  bcrypt,
  generateToken,
}: {
  memberStore: MemberStore;
  bcrypt;
  generateToken;
}): AuthenticateUseCase => {
  return async function ({ info }) {
    if (!info.username) {
      throw new MissingCredentialsError(`Please input username`);
    }

    if (!info.password) {
      throw new MissingCredentialsError(`Please input password`);
    }

    const usernameExists = await memberStore.selectOneMemberByFilters({
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

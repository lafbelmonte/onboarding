import { MemberStore } from '../../data-access/mongoose/members/actions';
import { MemberNotFoundError } from '../../custom-errors';
import { UseCase } from '../../types';

type DeleteOneMemberUseCaseInput = {
  id: string;
  info?: null;
  source?: {
    ip: string;
    browser: string;
    referrer?: string;
  };
};

type DeleteOneMemberUseCaseOutput = boolean;

export type DeleteOneMemberUseCase = UseCase<
  DeleteOneMemberUseCaseInput,
  DeleteOneMemberUseCaseOutput
>;

const deleteOneMember = ({
  memberStore,
}: {
  memberStore: MemberStore;
}): DeleteOneMemberUseCase => {
  return async function useCase({ id }) {
    const memberExists = await memberStore.memberExistsByFilter({
      _id: id,
    });

    if (!memberExists) {
      throw new MemberNotFoundError(`Member with ID: ${id} doesn't exists`);
    }

    await memberStore.deleteOneMember({ _id: id });

    return true;
  };
};

export default deleteOneMember;

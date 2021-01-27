import { MemberStore } from '../../data-access/mongoose/members/actions';
import { MemberNotFoundError } from '../../custom-errors';

type Input = {
  id: string;
  info?;
  source?;
};

type Output = boolean;

export type DeleteOneMemberUseCase = (input: Input) => Promise<Output>;

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

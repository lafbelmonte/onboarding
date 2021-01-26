import { MemberDocument } from '../../lib/mongoose/models/member';
import { MemberStore } from '../../data-access/mongoose/members/actions';
import { MemberNotFoundError } from '../../custom-errors';

type Input = {
  id: string;
  info?;
  source?;
};

type Output = MemberDocument;

export type SelectOneMemberUseCase = (input: Input) => Promise<Output>;

const selectOneMember = ({
  memberStore,
}: {
  memberStore: MemberStore;
}): SelectOneMemberUseCase => {
  return async function useCase({ id }) {
    const memberExists = await memberStore.memberExistsByFilter({
      _id: id,
    });

    if (!memberExists) {
      throw new MemberNotFoundError(`Member with ID: ${id} doesn't exists`);
    }

    const member = await memberStore.selectOneMemberByFilters({ _id: id });

    return member;
  };
};

export default selectOneMember;

import { MemberDocument } from '@lib/mongoose/models/member';
import { MemberStore } from '@data-access/mongoose/members/actions';
import { MemberNotFoundError } from '@custom-errors';
import { UseCase } from '@types';

type SelectOneMemberUseCaseInput = {
  id: string;
  info?: null;
  source?: {
    ip: string;
    browser: string;
    referrer?: string;
  };
};

type SelectOneMemberUseCaseOutput = MemberDocument;

export type SelectOneMemberUseCase = UseCase<
  SelectOneMemberUseCaseInput,
  SelectOneMemberUseCaseOutput
>;

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

    const member = await memberStore.selectOneMemberByFilters({
      _id: id,
    });

    return member;
  };
};

export default selectOneMember;

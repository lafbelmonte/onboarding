import { UseCase, MembersStore, PromosStore } from '../../types';

const enrollToPromo = ({
  membersStore,
  promosStore,
}: {
  membersStore: MembersStore;
  promosStore: PromosStore;
}): UseCase<boolean> => {
  return async function ({ info }) {
    console.log(info);

    if (!info.promo) {
      throw new Error(`Please input promo ID`);
    }

    if (!info.member) {
      throw new Error(`Please input member ID`);
    }

    return true;
  };
};

export default enrollToPromo;

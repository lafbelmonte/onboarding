import {
  UseCase,
  MembersStore,
  PromosStore,
  PromoTemplate,
  PromoStatus,
  PromoEnrollmentRequestsStore,
} from '../../types';

const enrollToPromo = ({
  membersStore,
  promosStore,
  R,
  promoEnrollmentRequestsStore,
  camelCase,
}: {
  membersStore: MembersStore;
  promosStore: PromosStore;
  R;
  promoEnrollmentRequestsStore: PromoEnrollmentRequestsStore;
  camelCase;
}): UseCase<boolean> => {
  return async function ({ id, info }) {
    if (!info.promo) {
      throw new Error(`Please input promo ID`);
    }

    const promo = await promosStore.selectOnePromoByFilters({
      _id: info.promo,
    });

    if (!promo) {
      throw new Error(`Promo not found`);
    }

    if (promo.status !== PromoStatus.Active) {
      throw new Error(`Promo is not active`);
    }

    const member = await membersStore.selectOneMemberByFilters({
      _id: id,
    });

    if (!member) {
      throw new Error(`Member not found`);
    }

    const promoEnrollmentExists = await promoEnrollmentRequestsStore.promoEnrollmentExistsByFilter(
      { promo: promo._id, member: member._id },
    );

    if (promoEnrollmentExists) {
      throw new Error(`You are already enrolled in this promo`);
    }

    if (promo.template === PromoTemplate.SignUp) {
      R.map((requiredMemberField) => {
        if (!member[camelCase(requiredMemberField)]) {
          throw new Error(
            `Required member field ${requiredMemberField} is missing`,
          );
        }

        return promo.requiredMemberFields;
      })(promo.requiredMemberFields);
    } else if (promo.template === PromoTemplate.Deposit) {
      if (!member.balance) {
        throw new Error(
          `You don't have enough balance to enroll in this promo`,
        );
      }

      if (!promo.minimumBalance) {
        throw new Error(`Minimum balance not set in the promo`);
      }

      if (member.balance < promo.minimumBalance) {
        throw new Error(
          `You don't have enough balance to enroll in this promo`,
        );
      }
    }

    await promoEnrollmentRequestsStore.insertPromoEnrollment({
      promo: promo._id,
      member: member._id,
    });

    return true;
  };
};

export default enrollToPromo;

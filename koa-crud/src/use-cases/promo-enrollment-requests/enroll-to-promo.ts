import {
  UseCase,
  MembersStore,
  PromosStore,
  PromoTemplate,
  PromoStatus,
  PromoEnrollmentRequestsStore,
} from '../../types';

import {
  MissingPromoEnrollmentRequestInformationError,
  PromoNotFoundError,
  InvalidPromoError,
  MemberNotFoundError,
  ExistingEnrollmentError,
  RequiredMemberFieldsNotMetError,
  NotEnoughBalanceError,
  MissingPromoInformationError,
} from '../../custom-errors';

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
      throw new MissingPromoEnrollmentRequestInformationError(
        `Please input promo ID`,
      );
    }

    const promo = await promosStore.selectOnePromoByFilters({
      _id: info.promo,
    });

    if (!promo) {
      throw new PromoNotFoundError(
        `Promo with ID: ${info.promo} doesn't exists`,
      );
    }

    if (promo.status !== PromoStatus.Active) {
      throw new InvalidPromoError(`Promo with ID: ${info.promo} not active`);
    }

    const member = await membersStore.selectOneMemberByFilters({
      _id: id,
    });

    if (!member) {
      throw new MemberNotFoundError(`Member with ID: ${id} doesn't exists`);
    }

    const promoEnrollmentExists = await promoEnrollmentRequestsStore.promoEnrollmentExistsByFilter(
      { promo: promo._id, member: member._id },
    );

    if (promoEnrollmentExists) {
      throw new ExistingEnrollmentError(
        `Member is already enrolled in this promo`,
      );
    }

    if (promo.template === PromoTemplate.SignUp) {
      R.map((requiredMemberField) => {
        if (!member[camelCase(requiredMemberField)]) {
          throw new RequiredMemberFieldsNotMetError(
            `Required member field ${requiredMemberField} is missing from member`,
          );
        }

        return promo.requiredMemberFields;
      })(promo.requiredMemberFields);
    } else if (promo.template === PromoTemplate.Deposit) {
      if (!member.balance) {
        throw new NotEnoughBalanceError(
          `Member doesn't enough balance to enroll in this promo`,
        );
      }

      if (!promo.minimumBalance) {
        throw new MissingPromoInformationError(
          `Minimum balance not set in the promo`,
        );
      }

      if (member.balance < promo.minimumBalance) {
        throw new NotEnoughBalanceError(
          `Member doesn't have enough balance to enroll in this promo`,
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

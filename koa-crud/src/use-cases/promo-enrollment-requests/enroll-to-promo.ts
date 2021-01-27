import { MemberStore } from '../../data-access/mongoose/members/actions';
import { PromoStore } from '../../data-access/mongoose/promos/actions';
import { PromoStatus, PromoTemplate } from '../../lib/mongoose/models/promo';
import { PromoEnrollmentRequestStore } from '../../data-access/mongoose/promo-enrollment-requests/actions';

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

type Input = {
  id?: string;
  info: {
    member: string;
    promo: string;
  };
  source?;
};

type Output = boolean;

export type EnrollToPromoUseCase = (input: Input) => Promise<Output>;

const enrollToPromo = ({
  memberStore,
  promoStore,
  R,
  promoEnrollmentRequestStore,
  camelCase,
}: {
  memberStore: MemberStore;
  promoStore: PromoStore;
  R;
  promoEnrollmentRequestStore: PromoEnrollmentRequestStore;
  camelCase;
}): EnrollToPromoUseCase => {
  return async function ({ info }) {
    if (!info.promo) {
      throw new MissingPromoEnrollmentRequestInformationError(
        `Please input promo ID`,
      );
    }

    if (!info.member) {
      throw new MissingPromoEnrollmentRequestInformationError(
        `Please input member ID`,
      );
    }

    const promo = await promoStore.selectOnePromoByFilters({
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

    const member = await memberStore.selectOneMemberByFilters({
      _id: info.member,
    });

    if (!member) {
      throw new MemberNotFoundError(
        `Member with ID: ${info.member} doesn't exists`,
      );
    }

    const promoEnrollmentExists = await promoEnrollmentRequestStore.promoEnrollmentExistsByFilter(
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

    await promoEnrollmentRequestStore.insertPromoEnrollment({
      promo: promo._id,
      member: member._id,
    });

    return true;
  };
};

export default enrollToPromo;

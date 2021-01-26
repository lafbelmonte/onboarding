import rType from 'ramda';
import {
  PromoTemplate,
  Promo,
  RequiredMemberFields,
} from '../../lib/mongoose/models/promo';
import {
  MissingPromoInformationError,
  InvalidPromoTemplateError,
  InvalidPromoInformationGivenError,
  InvalidPromoRequiredMemberFieldError,
} from '../../custom-errors';

type Input = {
  name: Promo['name'];
  template: Promo['template'];
  title: Promo['title'];
  description: Promo['description'];
  status: Promo['status'];
  minimumBalance: Promo['minimumBalance'];
  requiredMemberFields: Promo['requiredMemberFields'];
  submitted: Promo['submitted'];
  enabled: Promo['enabled'];
};

type Output = {
  name: Promo['name'];
  template: Promo['template'];
  title: Promo['title'];
  description: Promo['description'];
  status: Promo['status'];
  minimumBalance: Promo['minimumBalance'];
  requiredMemberFields: Promo['requiredMemberFields'];
  submitted: Promo['submitted'];
  enabled: Promo['enabled'];
};

export type PromoEntity = (input: Input) => Promise<Output>;

const entity = ({ R }: { R: typeof rType }): PromoEntity => {
  return async function promo({
    name,
    template,
    title,
    description,
    status,
    minimumBalance,
    requiredMemberFields,
    submitted,
    enabled,
  }) {
    if (!name) {
      throw new MissingPromoInformationError(`Please input name`);
    }

    if (!template) {
      throw new MissingPromoInformationError(`Please input template`);
    }

    if (!title) {
      throw new MissingPromoInformationError(`Please input title`);
    }

    if (!description) {
      throw new MissingPromoInformationError(`Please input description`);
    }

    if (!Object.values(PromoTemplate).includes(template)) {
      throw new InvalidPromoTemplateError(`Template: ${template} is invalid`);
    }

    if (template === PromoTemplate.SignUp) {
      if (minimumBalance) {
        throw new InvalidPromoInformationGivenError(
          `Invalid input field: minimumBalance for sign up`,
        );
      }

      if (!requiredMemberFields || requiredMemberFields.length === 0) {
        throw new MissingPromoInformationError(
          `Please input required member fields`,
        );
      }

      R.map((requiredMemberField: RequiredMemberFields) => {
        if (
          !Object.values(RequiredMemberFields).includes(requiredMemberField)
        ) {
          throw new InvalidPromoRequiredMemberFieldError(
            `Required member field: ${requiredMemberField} is invalid`,
          );
        }

        return requiredMemberFields;
      })(requiredMemberFields);
    }

    if (template === PromoTemplate.Deposit) {
      if (requiredMemberFields) {
        throw new InvalidPromoInformationGivenError(
          `Invalid input field: requiredMemberFields for deposit`,
        );
      }

      if (!minimumBalance) {
        throw new MissingPromoInformationError(`Please input minimum balance`);
      }
    }

    return {
      name,
      template,
      title,
      description,
      status,
      minimumBalance,
      requiredMemberFields,
      submitted,
      enabled,
    };
  };
};

export default entity;

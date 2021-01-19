import { PromoTemplate, Promo, RequiredMemberFields } from '../../types/index';

const entity = ({ R }) => {
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
  }): Promise<Promo> {
    if (!name) {
      throw new Error(`Please input name`);
    }

    if (!template) {
      throw new Error(`Please input template`);
    }

    if (!title) {
      throw new Error(`Please input title`);
    }

    if (!description) {
      throw new Error(`Please input description`);
    }

    if (!Object.values(PromoTemplate).includes(template)) {
      throw new Error(`Invalid template`);
    }

    if (template === PromoTemplate.SignUp) {
      if (minimumBalance) {
        throw new Error(`Invalid input field: minimumBalance for sign up`);
      }

      if (!requiredMemberFields || requiredMemberFields.length === 0) {
        throw new Error(`Please input required member fields`);
      }

      R.map((requiredMemberField) => {
        if (
          !Object.values(RequiredMemberFields).includes(requiredMemberField)
        ) {
          throw new Error(`Invalid member field`);
        }

        return requiredMemberFields;
      })(requiredMemberFields);
    }

    if (template === PromoTemplate.Deposit) {
      if (requiredMemberFields) {
        throw new Error(
          `Invalid input field: requiredMemberFields for deposit`,
        );
      }

      if (!minimumBalance) {
        throw new Error(`Please input minimum balance`);
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

import { enrollToPromoUseCase } from '../../use-cases/promo-enrollment-requests';

const enrollToPromo = async (obj, args, ctx) => {
  if (!ctx.allowed) {
    throw new Error('Forbidden');
  }

  return enrollToPromoUseCase({
    id: ctx.userId.data,
    info: args,
    source: null,
  });
};

export { enrollToPromo };

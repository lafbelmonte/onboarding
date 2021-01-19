import { enrollToPromoUseCase } from '../../use-cases/promo-enrollments';

const enrollToPromo = async (obj, args, ctx) => {
  if (!ctx.allowed) {
    throw new Error('Forbidden');
  }

  return enrollToPromoUseCase({
    id: ctx.userId.data,
    info: args.input,
    source: null,
  });
};

export { enrollToPromo };

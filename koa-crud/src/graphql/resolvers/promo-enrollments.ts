import { enrollToPromoUseCase } from '../../use-cases/promo-enrollments';

const enrollToPromo = async (obj, args) =>
  enrollToPromoUseCase({ id: null, info: args.input, source: null });

export { enrollToPromo };

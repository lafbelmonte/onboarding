import { insertPromoUseCase } from '../../use-cases/promos';

const createPromo = async (obj, args) =>
  insertPromoUseCase({ id: null, info: args.input, source: null });

export { createPromo };

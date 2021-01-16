import {
  insertPromoUseCase,
  selectAllPromosUseCase,
  selectOnePromoUseCase,
  updatePromoUseCase,
} from '../../use-cases/promos';

const createPromo = async (obj, args) =>
  insertPromoUseCase({ id: null, info: args.input, source: null });

const promos = async (obj, args, ctx) =>
  selectAllPromosUseCase({ id: null, info: null, source: null });

const promo = async (obj, args) =>
  selectOnePromoUseCase({ id: args.id, info: null, source: null });

const updatePromo = async (obj, args) =>
  updatePromoUseCase({
    id: args.input.id,
    info: args.input,
    source: null,
  });

export { createPromo, promos, promo, updatePromo };

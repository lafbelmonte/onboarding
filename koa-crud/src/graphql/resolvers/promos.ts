import {
  insertPromoUseCase,
  selectAllPromosUseCase,
  selectOnePromoUseCase,
  updatePromoUseCase,
  deleteOnePromoUseCase,
} from '../../use-cases/promos';

import { Promo, PromoDocument, Connection } from '../../types';

import paginate from '../../pagination';

const createPromo = async (obj, args: { input: Promo }): Promise<boolean> => {
  return insertPromoUseCase({ id: null, info: args.input, source: null });
};

const promos = async (obj, args): Promise<Connection<PromoDocument>> => {
  const data = await selectAllPromosUseCase({
    id: null,
    info: null,
    source: null,
  });
  return paginate<PromoDocument>({
    data,
    first: args.first,
    after: args.after,
  });
};

const promo = async (obj, args: Promo): Promise<PromoDocument> => {
  return selectOnePromoUseCase({ id: args.id, info: null, source: null });
};

const updatePromo = async (obj, args: { input: Promo }): Promise<boolean> => {
  return updatePromoUseCase({
    id: args.input.id,
    info: args.input,
    source: null,
  });
};

const deletePromo = async (obj, args: Promo): Promise<boolean> => {
  return deleteOnePromoUseCase({ id: args.id, info: null, source: null });
};

export { createPromo, promos, promo, updatePromo, deletePromo };

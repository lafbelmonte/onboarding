import {
  insertPromoUseCase,
  selectAllPromosUseCase,
  selectOnePromoUseCase,
  updatePromoUseCase,
  deleteOnePromoUseCase,
} from '../../use-cases/promos';

import paginate from '../../pagination';

import { PromoDocument } from '../../lib/mongoose/models/promo';
import { Connection } from '../../types';

const createPromo = async (obj, args): Promise<boolean> => {
  return insertPromoUseCase({ info: args.input });
};

const promos = async (obj, args): Promise<Connection<PromoDocument>> => {
  const data = await selectAllPromosUseCase({});
  return paginate({
    data,
    first: args.first,
    after: args.after,
  });
};

const promo = async (obj, args): Promise<PromoDocument> => {
  return selectOnePromoUseCase({ id: args.id });
};

const updatePromo = async (obj, args): Promise<boolean> => {
  return updatePromoUseCase({
    id: args.input.id,
    info: args.input,
  });
};

const deletePromo = async (obj, args): Promise<boolean> => {
  return deleteOnePromoUseCase({ id: args.id });
};

export { createPromo, promos, promo, updatePromo, deletePromo };

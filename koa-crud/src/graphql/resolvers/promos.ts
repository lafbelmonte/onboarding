import {
  insertPromoUseCase,
  selectAllPromosUseCase,
  selectOnePromoUseCase,
  updatePromoUseCase,
  deleteOnePromoUseCase,
} from '@use-cases/promos';

import { PromoDocument, Promo } from '@lib/mongoose/models/promo';
import { Connection } from '@types';
import { PaginateInput } from '@pagination/paginate-db-layer';

const createPromo = async (
  parent: null,
  args: {
    input: Omit<Promo, '_id' | 'cursor' | 'cursorBuffer'>;
  },
): Promise<boolean> => {
  return insertPromoUseCase({ info: args.input });
};

const promos = async (
  parent: null,
  args: Omit<PaginateInput, 'model'>,
): Promise<Connection<PromoDocument>> => {
  return selectAllPromosUseCase({ info: { ...args } });
};

const promo = async (
  parent: null,
  args: {
    id: string;
  },
): Promise<PromoDocument> => {
  return selectOnePromoUseCase({ id: args.id });
};

const updatePromo = async (
  parent: null,
  args: {
    input: {
      id: string;
    } & Omit<Promo, '_id' | 'cursor' | 'cursorBuffer'>;
  },
): Promise<boolean> => {
  return updatePromoUseCase({
    id: args.input.id,
    info: args.input,
  });
};

const deletePromo = async (
  parent: null,
  args: {
    id: string;
  },
): Promise<boolean> => {
  return deleteOnePromoUseCase({ id: args.id });
};

export { createPromo, promos, promo, updatePromo, deletePromo };

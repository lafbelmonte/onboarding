import R from 'ramda';

import { promoEntity } from '@entities/promo';

import { promoStore } from '@data-access/mongoose/promos';

import insertPromo from './insert-promo';
import selectAllPromos from './select-all-promos';
import selectOnePromo from './select-one-promo';
import updatePromo from './update-promo';
import deleteOnePromo from './delete-one-promo';

const insertPromoUseCase = insertPromo({ promoEntity, promoStore });
const selectAllPromosUseCase = selectAllPromos({ promoStore });
const selectOnePromoUseCase = selectOnePromo({ promoStore });
const updatePromoUseCase = updatePromo({ promoEntity, promoStore, R });
const deleteOnePromoUseCase = deleteOnePromo({ promoStore });

export {
  insertPromoUseCase,
  selectAllPromosUseCase,
  selectOnePromoUseCase,
  updatePromoUseCase,
  deleteOnePromoUseCase,
};

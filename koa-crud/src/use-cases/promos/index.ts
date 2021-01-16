import R from 'ramda';

import { promoEntity } from '../../entities/promo';

import { promosStore } from '../../data-access/mongoose/promos';

import insertPromo from './insert-promo';
import selectAllPromos from './select-all-promos';
import selectOnePromo from './select-one-promo';
import updatePromo from './update-promo';

const insertPromoUseCase = insertPromo({ promoEntity, promosStore });
const selectAllPromosUseCase = selectAllPromos({ promosStore });
const selectOnePromoUseCase = selectOnePromo({ promosStore });
const updatePromoUseCase = updatePromo({ promoEntity, promosStore, R });

export {
  insertPromoUseCase,
  selectAllPromosUseCase,
  selectOnePromoUseCase,
  updatePromoUseCase,
};

import R from 'ramda';

import { promoEntity } from '../../entities/promo';

import { promosStore } from '../../data-access/mongoose/promos';

import insertPromo from './insert-promo';
import selectAllPromos from './select-all-promos';
import selectOnePromo from './select-one-promo';
import updatePromo from './update-promo';
import deleteOnePromo from './delete-one-promo';

const insertPromoUseCase = insertPromo({ promoEntity, promosStore });
const selectAllPromosUseCase = selectAllPromos({ promosStore });
const selectOnePromoUseCase = selectOnePromo({ promosStore });
const updatePromoUseCase = updatePromo({ promoEntity, promosStore, R });
const deleteOnePromoUseCase = deleteOnePromo({ promosStore });

export {
  insertPromoUseCase,
  selectAllPromosUseCase,
  selectOnePromoUseCase,
  updatePromoUseCase,
  deleteOnePromoUseCase,
};

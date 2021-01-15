import { promoEntity } from '../../entities/promo';

import { promosStore } from '../../data-access/mongoose/promos';

import insertPromo from './insert-promo';

const insertPromoUseCase = insertPromo({ promoEntity, promosStore });

export { insertPromoUseCase };

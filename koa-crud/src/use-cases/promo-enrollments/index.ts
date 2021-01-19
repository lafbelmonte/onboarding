import R from 'ramda';
import camelCase from 'camelcase';
import { membersStore } from '../../data-access/mongoose/members';
import { promosStore } from '../../data-access/mongoose/promos';
import { promoEnrollmentsStore } from '../../data-access/mongoose/promo-enrollments';

import enrollToPromo from './enroll-to-promo';

const enrollToPromoUseCase = enrollToPromo({
  membersStore,
  promosStore,
  R,
  promoEnrollmentsStore,
  camelCase,
});

export { enrollToPromoUseCase };

import { membersStore } from '../../data-access/mongoose/members';
import { promosStore } from '../../data-access/mongoose/promos';

import enrollToPromo from './enroll-to-promo';

const enrollToPromoUseCase = enrollToPromo({ membersStore, promosStore });

export { enrollToPromoUseCase };

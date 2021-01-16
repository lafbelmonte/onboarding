import { PromosStore } from '../../../types/index';

const actions = ({ Promo }): PromosStore => {
  async function insertOnePromo(info) {
    return Promo.create(info);
  }

  async function selectAllPromos() {
    return Promo.find().lean({ virtuals: true });
  }

  async function selectOnePromoByFilters(filters) {
    return Promo.findOne(filters).lean({ virtuals: true });
  }

  return {
    insertOnePromo,
    selectAllPromos,
    selectOnePromoByFilters,
  };
};

export default actions;

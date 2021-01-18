import { PromosStore } from '../../../types/index';

const actions = ({ Promo }): PromosStore => {
  async function insertOnePromo(info) {
    return Promo.create(info);
  }

  async function promoExistsByFilter(filters) {
    return Promo.exists(filters);
  }

  async function selectAllPromos() {
    return Promo.find().lean({ virtuals: true });
  }

  async function selectOnePromoByFilters(filters) {
    return Promo.findOne(filters).lean({ virtuals: true });
  }

  async function updatePromoByFilters(filters, info) {
    return Promo.findOneAndUpdate(filters, info, {
      new: true,
    });
  }

  return {
    insertOnePromo,
    promoExistsByFilter,
    selectAllPromos,
    selectOnePromoByFilters,
    updatePromoByFilters,
  };
};

export default actions;

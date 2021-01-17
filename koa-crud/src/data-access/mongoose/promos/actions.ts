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

  async function deleteOnePromo(filters) {
    const vendor = await Promo.deleteOne(filters);

    const isDeleted = !!(vendor.ok === 1 && vendor.deletedCount === 1);

    return isDeleted;
  }

  return {
    insertOnePromo,
    promoExistsByFilter,
    selectAllPromos,
    selectOnePromoByFilters,
    updatePromoByFilters,
    deleteOnePromo,
  };
};

export default actions;

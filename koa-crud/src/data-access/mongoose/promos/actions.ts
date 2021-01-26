import PromoModelType, {
  Promo,
  PromoDocument,
} from '../../../lib/mongoose/models/promo';

type Information = {
  name?: Promo['name'];
  template?: Promo['template'];
  title?: Promo['title'];
  description?: Promo['description'];
  status?: Promo['status'];
  minimumBalance?: Promo['minimumBalance'];
  requiredMemberFields?: Promo['requiredMemberFields'];
  submitted?: Promo['submitted'];
  enabled?: Promo['enabled'];
};

type Filters = {
  _id?: string | Record<string, any>;
};

export type PromoStore = {
  insertOnePromo: (info: Information) => Promise<PromoDocument>;
  promoExistsByFilter: (filters: Filters) => Promise<boolean>;
  selectAllPromos: () => Promise<PromoDocument[]>;
  selectOnePromoByFilters: (filters: Filters) => Promise<PromoDocument>;
  updatePromoByFilters: (
    filters: Filters,
    info: Information,
  ) => Promise<PromoDocument>;
  deleteOnePromo: (filters: Filters) => Promise<boolean>;
};

export default ({
  PromoModel,
}: {
  PromoModel: typeof PromoModelType;
}): PromoStore => {
  async function insertOnePromo(info) {
    return PromoModel.create(info);
  }

  async function promoExistsByFilter(filters) {
    return PromoModel.exists(filters);
  }

  async function selectAllPromos() {
    return PromoModel.find().lean({ virtuals: true });
  }

  async function selectOnePromoByFilters(filters) {
    return PromoModel.findOne(filters).lean({ virtuals: true });
  }

  async function updatePromoByFilters(filters, info) {
    return PromoModel.findOneAndUpdate(filters, info, {
      new: true,
    });
  }

  async function deleteOnePromo(filters) {
    const vendor = await PromoModel.deleteOne(filters);

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

import PromoModelType, {
  Promo,
  PromoDocument,
} from '../../../lib/mongoose/models/promo';

type PromoInformation = Partial<
  Pick<
    Promo,
    | 'name'
    | 'template'
    | 'title'
    | 'description'
    | 'status'
    | 'minimumBalance'
    | 'requiredMemberFields'
    | 'submitted'
    | 'enabled'
  >
>;

type PromoFilters = {
  _id?: Promo['_id'] | Record<string, any>;
};

export type PromoStore = {
  insertOnePromo: (info: PromoInformation) => Promise<PromoDocument>;
  promoExistsByFilter: (filters: PromoFilters) => Promise<boolean>;
  selectAllPromos: () => Promise<PromoDocument[]>;
  selectOnePromoByFilters: (filters: PromoFilters) => Promise<PromoDocument>;
  updatePromoByFilters: (
    filters: PromoFilters,
    info: PromoInformation,
  ) => Promise<PromoDocument>;
  deleteOnePromo: (filters: PromoFilters) => Promise<boolean>;
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

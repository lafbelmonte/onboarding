import VendorModelType, {
  Vendor,
  VendorDocument,
} from '@lib/mongoose/models/vendor';

type VendorInformation = Partial<Pick<Vendor, 'name' | 'type'>>;

type VendorFilters = Partial<Pick<Vendor, '_id' | 'name' | 'type'>>;

export type VendorStore = {
  insertOneVendor: (info: VendorInformation) => Promise<VendorDocument>;
  vendorExistsByFilter: (filters: VendorFilters) => Promise<boolean>;
  selectAllVendors: () => Promise<VendorDocument[]>;
  selectOneVendorByFilters: (filters: VendorFilters) => Promise<VendorDocument>;
  updateVendorByFilters: (
    filters: VendorFilters,
    info: VendorInformation,
  ) => Promise<VendorDocument>;
  deleteOneVendor: (filters: VendorFilters) => Promise<boolean>;
};

export default ({
  VendorModel,
}: {
  VendorModel: typeof VendorModelType;
}): VendorStore => {
  async function insertOneVendor(info) {
    return VendorModel.create(info);
  }

  async function vendorExistsByFilter(filters) {
    return VendorModel.exists(filters);
  }

  async function selectAllVendors() {
    return VendorModel.find().lean({ virtuals: true });
  }

  async function selectOneVendorByFilters(filters) {
    return VendorModel.findOne(filters).lean({ virtuals: true });
  }

  async function updateVendorByFilters(filters, info) {
    return VendorModel.findOneAndUpdate(filters, info, {
      new: true,
      runValidators: true,
    });
  }

  async function deleteOneVendor(filters) {
    const vendor = await VendorModel.deleteOne(filters);

    const isDeleted = !!(vendor.ok === 1 && vendor.deletedCount === 1);

    return isDeleted;
  }
  return {
    insertOneVendor,
    vendorExistsByFilter,
    selectAllVendors,
    selectOneVendorByFilters,
    updateVendorByFilters,
    deleteOneVendor,
  };
};

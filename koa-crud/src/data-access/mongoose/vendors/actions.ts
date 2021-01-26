import VendorModelType, {
  Vendor,
  VendorDocument,
} from '../../../lib/mongoose/models/vendor';

type Information = {
  name?: Vendor['name'];
  type?: Vendor['type'];
};

type Filters = {
  _id?: string;
  name?: string;
  type?: string;
};

export type VendorStore = {
  insertOneVendor: (info: Information) => Promise<VendorDocument>;
  vendorExistsByFilter: (filters: Filters) => Promise<boolean>;
  selectAllVendors: () => Promise<VendorDocument[]>;
  selectOneVendorByFilters: (filters: Filters) => Promise<VendorDocument>;
  updateVendorByFilters: (
    filters: Filters,
    info: Information,
  ) => Promise<VendorDocument>;
  deleteOneVendor: (filters: Filters) => Promise<boolean>;
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

import { VendorsStore } from '../../../types/index';

const actions = ({ Vendor }): VendorsStore => {
  async function insertOneVendor(info) {
    return Vendor.create(info);
  }

  async function vendorExistsByFilter(filters) {
    return Vendor.exists(filters);
  }

  async function selectAllVendors() {
    return Vendor.find().lean({ virtuals: true });
  }

  async function selectOneVendorByFilters(filters) {
    return Vendor.findOne(filters).lean({ virtuals: true });
  }

  async function updateVendorByFilters(filters, info) {
    return Vendor.findOneAndUpdate(filters, info, {
      new: true,
      runValidators: true,
    });
  }

  async function deleteOneVendor(filters) {
    const vendor = await Vendor.deleteOne(filters);

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

export default actions;

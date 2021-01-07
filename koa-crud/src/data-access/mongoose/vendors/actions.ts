const actions = ({ Vendor }: any) => {
  async function insertOneVendor(info: any) {
    const vendor = Vendor.create({
      ...info,
    });
    return vendor;
  }

  async function vendorExistsByFilter(filters: any) {
    const exists = await Vendor.exists({ ...filters });
    return exists;
  }

  async function selectAllVendors() {
    const vendor = await Vendor.find().lean();
    return vendor;
  }

  async function selectOneVendorByFilters(filters: any) {
    const vendor = await Vendor.findOne({ ...filters });
    return vendor;
  }

  async function updateVendorByFilters(filters: any, info: any) {
    const user = await Vendor.findOneAndUpdate(
      { ...filters },
      { ...info },
      { new: true, runValidators: true }
    );
    return user;
  }

  async function deleteOneVendor(filters: any) {
    const vendor = await Vendor.deleteOne({ ...filters });

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

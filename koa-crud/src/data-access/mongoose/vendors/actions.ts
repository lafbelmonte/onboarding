const actions = ({ Vendor }: any) => {
  async function insertOneVendor(info: any) {
    const vendor = new Vendor({
      ...info,
    });
    await vendor.save();
    return vendor;
  }

  async function vendorExistsByFilter(filters: any) {
    const exists = await Vendor.exists({ ...filters });
    return exists;
  }

  async function selectAllVendors() {
    const vendor = await Vendor.find();
    return vendor;
  }

  async function selectOneVendorByFilters(filters: any) {
    const vendor = await Vendor.find({ ...filters });
    return vendor;
  }

  async function updateVendorByFilters(filters: any, info: any) {
    const user = await Vendor.findOneAndUpdate(
      { ...filters },
      { ...info },
      { new: true },
    );
    return user;
  }

  async function deleteOneVendor(filters: any) {
    const vendor = await Vendor.deleteOne({ ...filters });
    return vendor;
  }


  return {
    insertOneVendor,
    vendorExistsByFilter,
    selectAllVendors,
    selectOneVendorByFilters,
    updateVendorByFilters,
    deleteOneVendor
  };
};

export default actions;

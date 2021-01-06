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
    const vendor = await Vendor.find()
    return vendor
  }

  async function selectOneVendorByFilters(filters: any) {
    const vendor = await Vendor.find({ ...filters })
    return vendor
  }

  return { insertOneVendor, vendorExistsByFilter, selectAllVendors, selectOneVendorByFilters };
};

export default actions;

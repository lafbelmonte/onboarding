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

  return { insertOneVendor, vendorExistsByFilter, selectAllVendors };
};

export default actions;

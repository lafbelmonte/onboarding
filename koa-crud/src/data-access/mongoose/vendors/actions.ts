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

  return { insertOneVendor, vendorExistsByFilter };
};

export default actions;

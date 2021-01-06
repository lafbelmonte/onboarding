const updateVendor = ({ dVendors, eVendor }) => {
  return async function ({ id, ...info }: any) {
    const vendorExists = await dVendors.vendorExistsByFilter({
      _id: id,
    });

    if (!vendorExists) {
      throw new Error(`Vendor doesn't exist`);
    }

    const vendor = await eVendor({ _id: id, ...info });

    delete vendor.dateTimeCreated;

    const { _id } = vendor;

    delete vendor._id;

    const updated = dVendors.updateVendorByFilters({ _id }, { ...vendor });

    return updated;
  };
};

export default updateVendor;

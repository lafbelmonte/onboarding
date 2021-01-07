const updateVendor = ({ vendorsStore, vendorEntity }) => {
  return async function ({ id, ...info }: any): Promise<any> {
    const vendorExists = await vendorsStore.vendorExistsByFilter({
      _id: id,
    });

    if (!vendorExists) {
      throw new Error(`Vendor doesn't exist`);
    }

    const vendor = await vendorEntity({ _id: id, ...info });

    delete vendor.dateTimeCreated;

    const { _id } = vendor;

    delete vendor._id;

    const updated = vendorsStore.updateVendorByFilters({ _id }, { ...vendor });

    return updated;
  };
};

export default updateVendor;

const updateVendor = ({ vendorsStore, vendorEntity, R }) => {
  return async function ({ id, ...info }: any): Promise<any> {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error(`Invalid ID`);
    }

    const vendorExists = await vendorsStore.vendorExistsByFilter({
      _id: id,
    });

    if (!vendorExists) {
      throw new Error(`Vendor ID doesn't exist`);
    }

    const vendor = await vendorEntity({ ...info });

    const updated = vendorsStore.updateVendorByFilters(
      { _id: id },
      R.omit(['dateTimeCreated'], vendor),
    );

    return updated;
  };
};

export default updateVendor;

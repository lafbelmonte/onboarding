const insertVendor = ({ vendorsStore, vendorEntity }) => {
  return async function (info: any): Promise<any> {
    const vendor = await vendorEntity(info);

    const vendorExists = await vendorsStore.vendorExistsByFilter({
      _id: vendor._id,
    });

    if (vendorExists) {
      throw new Error(`ID already exists`);
    }

    const inserted = await vendorsStore.insertOneVendor(vendor);

    return inserted;
  };
};

export default insertVendor;

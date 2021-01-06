const insertVendor = ({ dVendors, eVendor }) => {
  return async function (info: any) {
    const vendor = await eVendor(info);

    const vendorExists = await dVendors.vendorExistsByFilter({
      _id: vendor._id,
    });

    if (vendorExists) {
      throw new Error(`ID already exists`);
    }

    const inserted = await dVendors.insertOneVendor(vendor);

    return inserted;
  };
};

export default insertVendor;

import { UseCase } from '../../types';

const insertVendor = ({ vendorsStore, vendorEntity }): UseCase => {
  return async function ({ info }) {
    const vendor = await vendorEntity(info);

    const vendorExists = await vendorsStore.vendorExistsByFilter({
      name: vendor.name,
    });

    if (vendorExists) {
      throw new Error(`Vendor already exists`);
    }

    const inserted = await vendorsStore.insertOneVendor(vendor);

    return inserted;
  };
};

export default insertVendor;

import { UseCase, VendorStore } from '../../types';

const insertVendor = ({
  vendorsStore,
  vendorEntity,
}: {
  vendorsStore: VendorStore;
  vendorEntity;
}): UseCase => {
  return async function ({ info }) {
    const vendor = await vendorEntity(info);

    const vendorExists = await vendorsStore.vendorExistsByFilter({
      name: vendor.name,
    });

    if (vendorExists) {
      throw new Error(`Vendor already exists`);
    }

    await vendorsStore.insertOneVendor(vendor);

    return true;
  };
};

export default insertVendor;

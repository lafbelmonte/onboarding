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

    const inserted = await vendorsStore.insertOneVendor(vendor);

    return {
      message: '',
      data: inserted,
    };
  };
};

export default insertVendor;

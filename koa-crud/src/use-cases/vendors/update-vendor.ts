import { UseCase, VendorStore } from '../../types';

const updateVendor = ({
  vendorsStore,
  vendorEntity,
  R,
}: {
  vendorsStore: VendorStore;
  vendorEntity;
  R;
}): UseCase => {
  return async function ({ id, info }) {
    const vendorExists = await vendorsStore.vendorExistsByFilter({
      _id: id,
    });

    if (!vendorExists) {
      throw new Error(`Vendor ID doesn't exist`);
    }

    const vendor = await vendorEntity({ ...info });

    await vendorsStore.updateVendorByFilters(
      { _id: id },
      R.omit(['dateTimeCreated'], vendor),
    );

    return true;
  };
};

export default updateVendor;

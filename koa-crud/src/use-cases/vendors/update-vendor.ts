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

    const updated = await vendorsStore.updateVendorByFilters(
      { _id: id },
      R.omit(['dateTimeCreated'], vendor),
    );

    return {
      message: '',
      data: updated,
    };
  };
};

export default updateVendor;

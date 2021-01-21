import { UseCase, VendorsStore } from '../../types';
import { VendorNotFoundError } from '../../custom-errors';
const updateVendor = ({
  vendorsStore,
  vendorEntity,
  R,
}: {
  vendorsStore: VendorsStore;
  vendorEntity;
  R;
}): UseCase<boolean> => {
  return async function ({ id, info }) {
    const vendorExists = await vendorsStore.vendorExistsByFilter({
      _id: id,
    });

    if (!vendorExists) {
      throw new VendorNotFoundError(`Vendor with ID: ${id} doesn't exists`);
    }

    const vendor = await vendorEntity(info);

    await vendorsStore.updateVendorByFilters(
      { _id: id },
      R.omit(['dateTimeCreated'], vendor),
    );

    return true;
  };
};

export default updateVendor;

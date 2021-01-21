import { UseCase, VendorsStore } from '../../types';
import { VendorNotFoundError } from '../../custom-errors';
const deleteOneVendor = ({
  vendorsStore,
}: {
  vendorsStore: VendorsStore;
}): UseCase<boolean> => {
  return async function useCase({ id }) {
    const vendorExists = await vendorsStore.vendorExistsByFilter({
      _id: id,
    });

    if (!vendorExists) {
      throw new VendorNotFoundError(`Vendor with ID ${id} doesn't exists`);
    }

    await vendorsStore.deleteOneVendor({ _id: id });

    return true;
  };
};

export default deleteOneVendor;

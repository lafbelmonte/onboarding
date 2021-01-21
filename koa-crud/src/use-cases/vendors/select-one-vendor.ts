import { UseCase, VendorsStore, VendorDocument } from '../../types';
import { VendorNotFoundError } from '../../custom-errors';
const selectOneVendor = ({
  vendorsStore,
}: {
  vendorsStore: VendorsStore;
}): UseCase<VendorDocument> => {
  return async function useCase({ id }) {
    const vendorExists = await vendorsStore.vendorExistsByFilter({
      _id: id,
    });

    if (!vendorExists) {
      throw new VendorNotFoundError(`Vendor with ID: ${id} doesn't exists`);
    }

    const vendor = await vendorsStore.selectOneVendorByFilters({ _id: id });

    return vendor;
  };
};

export default selectOneVendor;

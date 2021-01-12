import { UseCase, VendorStore } from '../../types';

const selectOneVendor = ({
  vendorsStore,
}: {
  vendorsStore: VendorStore;
}): UseCase => {
  return async function useCase({ id }) {
    const vendorExists = await vendorsStore.vendorExistsByFilter({
      _id: id,
    });

    if (!vendorExists) {
      throw new Error(`Vendor doesn't exist`);
    }

    const vendor = await vendorsStore.selectOneVendorByFilters({ _id: id });

    return vendor;
  };
};

export default selectOneVendor;

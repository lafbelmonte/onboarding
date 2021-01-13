import { UseCase, VendorsStore } from '../../types';

const selectOneVendor = ({
  vendorsStore,
}: {
  vendorsStore: VendorsStore;
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

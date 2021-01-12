import { UseCase, VendorStore } from '../../types';

const selectAllVendors = ({
  vendorsStore,
}: {
  vendorsStore: VendorStore;
}): UseCase => {
  return async function useCase() {
    const vendors = await vendorsStore.selectAllVendors();
    return vendors;
  };
};

export default selectAllVendors;

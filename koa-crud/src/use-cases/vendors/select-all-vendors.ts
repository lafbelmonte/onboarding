import { UseCase, VendorsStore } from '../../types';

const selectAllVendors = ({
  vendorsStore,
}: {
  vendorsStore: VendorsStore;
}): UseCase => {
  return async function useCase() {
    const vendors = await vendorsStore.selectAllVendors();
    return vendors;
  };
};

export default selectAllVendors;

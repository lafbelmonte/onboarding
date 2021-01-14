import { UseCase, VendorsStore, VendorDocument } from '../../types';

const selectAllVendors = ({
  vendorsStore,
}: {
  vendorsStore: VendorsStore;
}): UseCase<VendorDocument[]> => {
  return async function useCase() {
    const vendors = await vendorsStore.selectAllVendors();
    return vendors;
  };
};

export default selectAllVendors;

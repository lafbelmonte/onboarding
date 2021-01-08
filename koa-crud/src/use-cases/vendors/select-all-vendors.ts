import { UseCase, VendorStore } from '../../types';

const selectAllVendors = ({
  vendorsStore,
}: {
  vendorsStore: VendorStore;
}): UseCase => {
  return async function useCase() {
    const view = await vendorsStore.selectAllVendors();
    return {
      message: '',
      data: view,
    };
  };
};

export default selectAllVendors;

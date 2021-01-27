import { VendorStore } from '../../data-access/mongoose/vendors/actions';
import { VendorDocument } from '../../lib/mongoose/models/vendor';

type Input = {
  id?: string;
  info?;
  source?;
};

type Output = VendorDocument[];

export type SelectAllVendorsUseCase = (input: Input) => Promise<Output>;

const selectAllVendors = ({
  vendorStore,
}: {
  vendorStore: VendorStore;
}): SelectAllVendorsUseCase => {
  return async function useCase() {
    const vendors = await vendorStore.selectAllVendors();
    return vendors;
  };
};

export default selectAllVendors;

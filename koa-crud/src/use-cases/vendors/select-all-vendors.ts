import { VendorStore } from '@data-access/mongoose/vendors/actions';
import { VendorDocument } from '@lib/mongoose/models/vendor';
import { UseCase } from '@types';

type SelectAllVendorsUseCaseInput = {
  id?: string;
  info?: null;
  source?: {
    ip: string;
    browser: string;
    referrer?: string;
  };
};

type SelectAllVendorsUseCaseOutput = VendorDocument[];

export type SelectAllVendorsUseCase = UseCase<
  SelectAllVendorsUseCaseInput,
  SelectAllVendorsUseCaseOutput
>;

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

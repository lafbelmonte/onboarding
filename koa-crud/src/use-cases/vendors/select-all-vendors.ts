import { VendorStore } from '@data-access/mongoose/vendors/actions';
import { VendorDocument } from '@lib/mongoose/models/vendor';
import { UseCase, Connection } from '@types';

type SelectAllVendorsUseCaseInput = {
  id?: string;
  info?: {
    first: number;
    after: string;
  };
  source?: {
    ip: string;
    browser: string;
    referrer?: string;
  };
};

type SelectAllVendorsUseCaseOutput = Connection<VendorDocument>;

export type SelectAllVendorsUseCase = UseCase<
  SelectAllVendorsUseCaseInput,
  SelectAllVendorsUseCaseOutput
>;

const selectAllVendors = ({
  vendorStore,
}: {
  vendorStore: VendorStore;
}): SelectAllVendorsUseCase => {
  return async function useCase({ info }) {
    const vendors = await vendorStore.paginatedVendors(info);
    return vendors;
  };
};

export default selectAllVendors;

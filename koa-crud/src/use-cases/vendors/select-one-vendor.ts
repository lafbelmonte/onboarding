import { VendorDocument } from '@lib/mongoose/models/vendor';
import { VendorStore } from '@data-access/mongoose/vendors/actions';
import { VendorNotFoundError } from '@custom-errors';
import { UseCase } from '@types';

type SelectOneVendorUseCaseInput = {
  id: string;
  info?: null;
  source?: {
    ip: string;
    browser: string;
    referrer?: string;
  };
};

type SelectOneVendorUseCaseOutput = VendorDocument;

export type SelectOneVendorUseCase = UseCase<
  SelectOneVendorUseCaseInput,
  SelectOneVendorUseCaseOutput
>;

const selectOneVendor = ({
  vendorStore,
}: {
  vendorStore: VendorStore;
}): SelectOneVendorUseCase => {
  return async function useCase({ id }) {
    const vendorExists = await vendorStore.vendorExistsByFilter({
      _id: id,
    });

    if (!vendorExists) {
      throw new VendorNotFoundError(`Vendor with ID: ${id} doesn't exists`);
    }

    const vendor = await vendorStore.selectOneVendorByFilters({ _id: id });

    return vendor;
  };
};

export default selectOneVendor;

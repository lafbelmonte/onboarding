import { VendorNotFoundError } from '../../custom-errors';
import { VendorStore } from '../../data-access/mongoose/vendors/actions';
import { UseCase } from '../../types';

type DeleteOneVendorUseCaseInput = {
  id: string;
  info?: null;
  source?: {
    ip: string;
    browser: string;
    referrer?: string;
  };
};

type DeleteOneVendorUseCaseOutput = boolean;

export type DeleteOneVendorUseCase = UseCase<
  DeleteOneVendorUseCaseInput,
  DeleteOneVendorUseCaseOutput
>;

const deleteOneVendor = ({
  vendorStore,
}: {
  vendorStore: VendorStore;
}): DeleteOneVendorUseCase => {
  return async function useCase({ id }) {
    const vendorExists = await vendorStore.vendorExistsByFilter({
      _id: id,
    });

    if (!vendorExists) {
      throw new VendorNotFoundError(`Vendor with ID ${id} doesn't exists`);
    }

    await vendorStore.deleteOneVendor({ _id: id });

    return true;
  };
};

export default deleteOneVendor;

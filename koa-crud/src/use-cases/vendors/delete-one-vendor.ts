import { VendorNotFoundError } from '../../custom-errors';
import { VendorStore } from '../../data-access/mongoose/vendors/actions';

type Input = {
  id: string;
  info?;
  source?;
};

type Output = boolean;

export type DeleteOneVendorUseCase = (input: Input) => Promise<Output>;

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

import { VendorDocument } from '../../lib/mongoose/models/vendor';
import { VendorStore } from '../../data-access/mongoose/vendors/actions';
import { VendorNotFoundError } from '../../custom-errors';

type Input = {
  id: string;
  info?;
  source?;
};

type Output = VendorDocument;

export type SelectOneVendorUseCase = (input: Input) => Promise<Output>;

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

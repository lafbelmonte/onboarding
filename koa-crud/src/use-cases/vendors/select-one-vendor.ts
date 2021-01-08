import { UseCase, VendorStore } from '../../types';

const selectOneVendor = ({
  vendorsStore,
}: {
  vendorsStore: VendorStore;
}): UseCase => {
  return async function useCase({ id }) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      throw new Error(`Invalid ID`);
    }

    const vendorExists = await vendorsStore.vendorExistsByFilter({
      _id: id,
    });

    if (!vendorExists) {
      throw new Error(`Vendor doesn't exist`);
    }

    const vendor = await vendorsStore.selectOneVendorByFilters({ _id: id });

    return {
      message: '',
      data: vendor,
    };
  };
};

export default selectOneVendor;

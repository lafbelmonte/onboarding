import { UseCase, VendorsStore } from '../../types';

const deleteOneVendor = ({
  vendorsStore,
}: {
  vendorsStore: VendorsStore;
}): UseCase<boolean> => {
  return async function useCase({ id }) {
    const vendorExists = await vendorsStore.vendorExistsByFilter({
      _id: id,
    });

    if (!vendorExists) {
      throw new Error(`Vendor doesn't exist`);
    }

    await vendorsStore.deleteOneVendor({ _id: id });

    return true;
  };
};

export default deleteOneVendor;

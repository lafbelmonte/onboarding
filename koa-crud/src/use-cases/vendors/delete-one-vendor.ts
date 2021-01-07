import { UseCase } from '../../types';

const deleteOneVendor = ({ vendorsStore }): UseCase => {
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

    const deleted = vendorsStore.deleteOneVendor({ _id: id });

    return deleted;
  };
};

export default deleteOneVendor;

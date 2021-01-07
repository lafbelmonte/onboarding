const deleteOneVendor = ({ vendorsStore }) => {
  return async function useCase({ id }: any): Promise<any> {
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

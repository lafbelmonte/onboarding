const selectOneVendor = ({ vendorsStore }) => {
  return async function useCase({ id }: any): Promise<any> {
    const vendorExists = await vendorsStore.vendorExistsByFilter({
      _id: id,
    });

    if (!vendorExists) {
      throw new Error(`Vendor doesn't exist`);
    }

    const vendor = await vendorsStore.selectOneVendorByFilters({ _id: id });
    return vendor;
  };
};

export default selectOneVendor;

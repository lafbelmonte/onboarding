const deleteOneVendor = ({ dVendors }) => {
  return async function useCase({ id }: any) {

    const vendorExists = await dVendors.vendorExistsByFilter({
      _id: id,
    });

    if (!vendorExists) {
      throw new Error(`Vendor doesn't exist`);
    }

    const deleted = dVendors.deleteOneVendor({ _id: id })

    return deleted;
  };
};

export default deleteOneVendor;

const selectOneVendor = ({ dVendors }) => {
  return async function useCase({ id }: any) {

    const vendorExists = await dVendors.vendorExistsByFilter({
      _id: id,
    });

    if(!vendorExists){
      throw new Error(`Vendor doesn't exist`)
    }

    const vendor = await dVendors.selectOneVendorByFilters({ _id: id })
    return vendor;
  };
};

export default selectOneVendor;

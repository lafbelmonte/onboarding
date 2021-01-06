const selectAllVendors = ({ dVendors }) => {
  return async function useCase() {
    const view = dVendors.selectAllVendors();
    return view;
  };
};

export default selectAllVendors;

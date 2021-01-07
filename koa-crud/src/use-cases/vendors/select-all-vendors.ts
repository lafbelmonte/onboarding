const selectAllVendors = ({ vendorsStore }) => {
  return async function useCase(): Promise<any> {
    const view = vendorsStore.selectAllVendors();
    return view;
  };
};

export default selectAllVendors;

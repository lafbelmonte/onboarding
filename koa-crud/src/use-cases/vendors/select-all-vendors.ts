import { UseCase } from '../../types';

const selectAllVendors = ({ vendorsStore }): UseCase => {
  return async function useCase() {
    const view = await vendorsStore.selectAllVendors();
    return view;
  };
};

export default selectAllVendors;

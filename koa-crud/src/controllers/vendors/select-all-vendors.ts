import { Controller } from '../../types';
import { SelectAllVendorsUseCase } from '../../use-cases/vendors/select-all-vendors';

const selectAllVendors = ({
  selectAllVendorsUseCase,
}: {
  selectAllVendorsUseCase: SelectAllVendorsUseCase;
}): Controller => {
  return async function controller() {
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const view = await selectAllVendorsUseCase({});

      return {
        headers,
        statusCode: 200,
        body: view,
      };
    } catch (e) {
      return {
        headers,
        statusCode: 400,
        body: {
          error: e.message,
        },
      };
    }
  };
};

export default selectAllVendors;

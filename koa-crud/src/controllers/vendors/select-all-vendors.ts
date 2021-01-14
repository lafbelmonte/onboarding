import { Controller, UseCase, VendorDocument } from '../../types';

const selectAllVendors = ({
  selectAllVendorsUseCase,
}: {
  selectAllVendorsUseCase: UseCase<VendorDocument[]>;
}): Controller => {
  return async function controller() {
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const view = await selectAllVendorsUseCase({
        id: null,
        info: null,
        source: null,
      });

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

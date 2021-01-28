import { Controller } from '@types';
import { SelectOneVendorUseCase } from '@use-cases/vendors/select-one-vendor';

const selectOneVendor = ({
  selectOneVendorUseCase,
}: {
  selectOneVendorUseCase: SelectOneVendorUseCase;
}): Controller => {
  return async function controller(httpRequest) {
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const view = await selectOneVendorUseCase({
        id: httpRequest.params.id,
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

export default selectOneVendor;

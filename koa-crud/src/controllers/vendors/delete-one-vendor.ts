import { Controller } from '../../types';
import { DeleteOneVendorUseCase } from '../../use-cases/vendors/delete-one-vendor';

const deleteOneVendor = ({
  deleteOneVendorUseCase,
}: {
  deleteOneVendorUseCase: DeleteOneVendorUseCase;
}): Controller => {
  return async function controller(httpRequest) {
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const deleted = await deleteOneVendorUseCase({
        id: httpRequest.params.id,
        info: null,
        source: null,
      });

      return {
        headers,
        statusCode: 200,
        body: deleted,
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

export default deleteOneVendor;

import { UseCase, Controller } from '../../types';

const deleteOneVendor = ({
  deleteOneVendorUseCase,
}: {
  deleteOneVendorUseCase: UseCase;
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
        body: { deleted },
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

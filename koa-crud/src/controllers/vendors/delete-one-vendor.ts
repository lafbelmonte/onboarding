import { HttpRequest, HttpResponse } from '../../types';

const deleteOneVendor = ({ deleteOneVendorUseCase }: any) => {
  return async function controller(
    httpRequest: HttpRequest,
  ): Promise<HttpResponse> {
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const deleted = await deleteOneVendorUseCase({
        id: httpRequest.params.id,
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

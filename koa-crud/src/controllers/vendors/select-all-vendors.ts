import { HttpRequest, HttpResponse } from '../../types';

const selectAllVendors = ({ selectAllVendorsUseCase }: any) => {
  return async function controller(
    httpRequest: HttpRequest,
  ): Promise<HttpResponse> {
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const view = await selectAllVendorsUseCase();

      return {
        headers,
        statusCode: 200,
        body: { view },
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

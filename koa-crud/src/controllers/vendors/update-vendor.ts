import { HttpRequest, HttpResponse } from '../../types';

const updateVendor = ({ updateVendorUseCase }: any) => {
  return async function controller(
    httpRequest: HttpRequest,
  ): Promise<HttpResponse> {
    try {
      const { source = {}, ...info } = httpRequest.body;
      source.ip = httpRequest.ip;
      source.browser = httpRequest.headers['User-Agent'];
      if (httpRequest.headers.Referer) {
        source.referrer = httpRequest.headers.Referer;
      }
      const toEdit = {
        ...info,
        source,
        id: httpRequest.params.id,
      };
      const putted = await updateVendorUseCase(toEdit);
      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date().toUTCString(),
        },
        statusCode: 204,
        body: { putted },
      };
    } catch (e) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          error: e.message,
        },
      };
    }
  };
};

export default updateVendor;

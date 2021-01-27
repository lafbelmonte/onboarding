import { Controller } from '../../types';
import { UpdateVendorUseCase } from '../../use-cases/vendors/update-vendor';

const updateVendor = ({
  updateVendorUseCase,
}: {
  updateVendorUseCase: UpdateVendorUseCase;
}): Controller => {
  return async function controller(httpRequest) {
    try {
      const { source = {}, ...info } = httpRequest.body;
      source.ip = httpRequest.ip;
      source.browser = httpRequest.headers['User-Agent'];
      if (httpRequest.headers.Referer) {
        source.referrer = httpRequest.headers.Referer;
      }
      const toEdit = {
        info,
        source,
        id: httpRequest.params.id,
      };
      const put = await updateVendorUseCase(toEdit);
      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date().toUTCString(),
        },
        statusCode: 204,
        body: put,
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

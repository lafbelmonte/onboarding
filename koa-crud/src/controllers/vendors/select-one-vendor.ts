import { UseCase, Controller, VendorDocument } from '../../types';

const selectOneVendor = ({
  selectOneVendorUseCase,
}: {
  selectOneVendorUseCase: UseCase<VendorDocument>;
}): Controller => {
  return async function controller(httpRequest) {
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const view = await selectOneVendorUseCase({
        id: httpRequest.params.id,
        source: null,
        info: null,
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

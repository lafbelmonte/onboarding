const selectOneVendor = ({ uSelectOneVendor }: any) => {
  return async function controller(httpRequest: any) {
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const view = await uSelectOneVendor({ id: httpRequest.params.id });

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

export default selectOneVendor;

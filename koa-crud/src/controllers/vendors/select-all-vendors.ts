const selectAllVendors = ({ uSelectAllVendors }: any) => {
  return async function controller(httpRequest: any) {
    const headers = {
      'Content-Type': 'application/json',
    };

    try {
      const view = await uSelectAllVendors();

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

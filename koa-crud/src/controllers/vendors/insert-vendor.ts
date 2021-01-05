const insertVendor = ({ uInsertVendor }: any) => {
  return async function controller(httpRequest: any) {
    try {
      const { source = {}, ...info } = httpRequest.body;
      source.ip = httpRequest.ip;
      source.browser = httpRequest.headers['User-Agent'];
      if (httpRequest.headers.Referer) {
        source.referrer = httpRequest.headers.Referer;
      }
      const posted = await uInsertVendor({
        ...info,
        source,
      });
      return {
        headers: {
          'Content-Type': 'application/json',
          'Last-Modified': new Date().toUTCString(),
        },
        statusCode: 201,
        body: { posted },
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

export default insertVendor;

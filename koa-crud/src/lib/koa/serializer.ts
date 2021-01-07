import { Serializer } from '../../types';

const serialize: Serializer = (controller) => {
  return async (ctx) => {
    const httpRequest = {
      body: ctx.request.body,
      query: ctx.query,
      params: ctx.params,
      ip: ctx.ip,
      method: ctx.method,
      path: ctx.path,
      headers: {
        'Content-Type': ctx.get('Content-Type'),
        Referer: ctx.get('Referer'),
        'User-Agent': ctx.get('User-Agent'),
      },
    };

    try {
      const httpResponse = await controller(httpRequest);
      if (httpResponse.headers) {
        ctx.set(httpResponse.headers);
      }
      ctx.type = 'json';
      ctx.status = httpResponse.statusCode;
      ctx.body = httpResponse.body;
    } catch (e) {
      ctx.status = 500;
      ctx.body = {
        error: 'An unkown error occurred.',
      };
    }
  };
};

export default serialize;

import { AuthenticateUseCase } from '@use-cases/auth/authenticate';
import { Controller } from '@types';

const authenticate = ({
  authenticateUseCase,
}: {
  authenticateUseCase: AuthenticateUseCase;
}): Controller => {
  return async function controller(httpRequest) {
    try {
      const { source = {}, ...info } = httpRequest.body;
      source.ip = httpRequest.ip;
      source.browser = httpRequest.headers['User-Agent'];
      if (httpRequest.headers.Referer) {
        source.referrer = httpRequest.headers.Referer;
      }
      const token = await authenticateUseCase({
        info,
      });
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 200,
        body: { token },
      };
    } catch (e) {
      return {
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 400,
        body: {
          code: e.extensions.code,
          error: e.message,
        },
      };
    }
  };
};

export default authenticate;

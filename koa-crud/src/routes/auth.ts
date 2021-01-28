import Router from 'koa-router';

import { Serializer } from '@types';

import { authenticateController } from '@controllers/auth';

const prefix = '/auth';

const endPoints = (router: Router, serializer: Serializer): Router => {
  router.post(`${prefix}`, serializer(authenticateController));

  return router;
};

export default endPoints;

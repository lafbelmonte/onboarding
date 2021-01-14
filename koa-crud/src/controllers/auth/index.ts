import { authenticateUseCase } from '../../use-cases/auth';

import authenticate from './authenticate';

const authenticateController = authenticate({
  authenticateUseCase,
});

export { authenticateController };

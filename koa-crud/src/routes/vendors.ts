import Router from 'koa-router';

import { Serializer } from '../types';

import {
  selectAllVendorsController,
  selectOneVendorController,
  insertVendorController,
  updateVendorController,
  deleteOneVendorController,
} from '../controllers/vendors';

const prefix = '/vendors';

const endPoints = (router: Router, serializer: Serializer): Router => {
  router.get(`${prefix}`, serializer(selectAllVendorsController));

  router.get(`${prefix}/:id`, serializer(selectOneVendorController));

  router.post(`${prefix}`, serializer(insertVendorController));

  router.put(`${prefix}/:id`, serializer(updateVendorController));

  router.delete(`${prefix}/:id`, serializer(deleteOneVendorController));

  return router;
};

export default endPoints;

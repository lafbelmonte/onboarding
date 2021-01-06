import {
  cInsertVendor,
  cSelectAllVendors,
  cSelectOneVendor,
  cUpdateVendor,
  cdeleteOneVendor
} from '../controllers/vendors';

const prefix = '/vendors';

const endPoints = (router: any, serializer: any) => {

  router.get(`${prefix}`, serializer(cSelectAllVendors));

  router.get(`${prefix}/:id`, serializer(cSelectOneVendor));

  router.post(`${prefix}`, serializer(cInsertVendor));

  router.put(`${prefix}/:id`, serializer(cUpdateVendor));

  router.delete(`${prefix}/:id`, serializer(cdeleteOneVendor))

  return router;
};

export default endPoints;

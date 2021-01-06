import {
  uInsertVendor,
  uSelectAllVendors,
  uSelectOneVendor,
  uUpdateVendor,
  udeleteOneVendor
} from '../../use-cases/vendors';

import selectAllVendors from './select-all-vendors';
import selectOneVendor from './select-one-vendor';
import insertVendor from './insert-vendor';
import updateVendor from './update-vendor';
import deleteOneVendor from './delete-one-vendor'

const cSelectAllVendors = selectAllVendors({ uSelectAllVendors });
const cSelectOneVendor = selectOneVendor({ uSelectOneVendor });
const cInsertVendor = insertVendor({ uInsertVendor });
const cUpdateVendor = updateVendor({ uUpdateVendor });
const cdeleteOneVendor = deleteOneVendor({ udeleteOneVendor })

export { cSelectAllVendors, cSelectOneVendor, cInsertVendor, cUpdateVendor, cdeleteOneVendor };

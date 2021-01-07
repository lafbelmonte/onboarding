import { vendorEntity } from '../../entities/vendor';

import { vendorsStore } from '../../data-access/mongoose/vendors';

import selectAllVendors from './select-all-vendors';
import selectOneVendor from './select-one-vendor';
import insertVendor from './insert-vendor';
import updateVendor from './update-vendor';
import deleteOneVendor from './delete-one-vendor';

const selectAllVendorsUseCase = selectAllVendors({ vendorsStore });
const selectOneVendorUseCase = selectOneVendor({ vendorsStore });
const insertVendorUseCase = insertVendor({ vendorsStore, vendorEntity });
const updateVendorUseCase = updateVendor({ vendorsStore, vendorEntity });
const deleteOneVendorUseCase = deleteOneVendor({ vendorsStore });

export {
  selectAllVendorsUseCase,
  selectOneVendorUseCase,
  insertVendorUseCase,
  updateVendorUseCase,
  deleteOneVendorUseCase,
};

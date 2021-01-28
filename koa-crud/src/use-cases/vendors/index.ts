import R from 'ramda';

import { vendorEntity } from '@entities/vendor';

import { vendorStore } from '@data-access/mongoose/vendors';

import selectAllVendors from './select-all-vendors';
import selectOneVendor from './select-one-vendor';
import insertVendor from './insert-vendor';
import updateVendor from './update-vendor';
import deleteOneVendor from './delete-one-vendor';

const selectAllVendorsUseCase = selectAllVendors({ vendorStore });
const selectOneVendorUseCase = selectOneVendor({ vendorStore });
const insertVendorUseCase = insertVendor({ vendorStore, vendorEntity });
const updateVendorUseCase = updateVendor({ vendorStore, vendorEntity, R });
const deleteOneVendorUseCase = deleteOneVendor({ vendorStore });

export {
  selectAllVendorsUseCase,
  selectOneVendorUseCase,
  insertVendorUseCase,
  updateVendorUseCase,
  deleteOneVendorUseCase,
};

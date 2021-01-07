import {
  selectAllVendorsUseCase,
  selectOneVendorUseCase,
  insertVendorUseCase,
  updateVendorUseCase,
  deleteOneVendorUseCase,
} from '../../use-cases/vendors';

import selectAllVendors from './select-all-vendors';
import selectOneVendor from './select-one-vendor';
import insertVendor from './insert-vendor';
import updateVendor from './update-vendor';
import deleteOneVendor from './delete-one-vendor';

const selectAllVendorsController = selectAllVendors({
  selectAllVendorsUseCase,
});
const selectOneVendorController = selectOneVendor({ selectOneVendorUseCase });
const insertVendorController = insertVendor({ insertVendorUseCase });
const updateVendorController = updateVendor({ updateVendorUseCase });
const deleteOneVendorController = deleteOneVendor({ deleteOneVendorUseCase });

export {
  selectAllVendorsController,
  selectOneVendorController,
  insertVendorController,
  updateVendorController,
  deleteOneVendorController,
};

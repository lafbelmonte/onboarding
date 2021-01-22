import {
  selectAllVendorsUseCase,
  insertVendorUseCase,
  selectOneVendorUseCase,
  updateVendorUseCase,
  deleteOneVendorUseCase,
} from '../../use-cases/vendors';

import { Vendor, VendorDocument } from '../../types';

import { NotAllowedError } from '../../custom-errors';

const vendors = async (obj, args: Vendor, ctx): Promise<VendorDocument[]> => {
  if (!ctx.allowed) {
    throw new NotAllowedError('You are not allowed to access this resource');
  }
  return selectAllVendorsUseCase({ id: null, info: null, source: null });
};
const vendor = async (obj, args: Vendor, ctx): Promise<VendorDocument> => {
  if (!ctx.allowed) {
    throw new NotAllowedError('You are not allowed to access this resource');
  }
  return selectOneVendorUseCase({ id: args.id, info: null, source: null });
};

const createVendor = async (
  obj,
  args: { input: Vendor },
  ctx,
): Promise<boolean> => {
  if (!ctx.allowed) {
    throw new NotAllowedError('You are not allowed to access this resource');
  }

  return insertVendorUseCase({ id: null, info: args.input, source: null });
};
const updateVendor = async (
  obj,
  args: { input: Vendor },
  ctx,
): Promise<boolean> => {
  if (!ctx.allowed) {
    throw new NotAllowedError('You are not allowed to access this resource');
  }

  return updateVendorUseCase({
    id: args.input.id,
    info: args.input,
    source: null,
  });
};
const deleteVendor = async (obj, args: Vendor, ctx): Promise<boolean> => {
  if (!ctx.allowed) {
    throw new NotAllowedError('You are not allowed to access this resource');
  }
  return deleteOneVendorUseCase({ id: args.id, info: null, source: null });
};

export { vendors, vendor, createVendor, updateVendor, deleteVendor };

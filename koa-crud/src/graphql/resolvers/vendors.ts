import {
  selectAllVendorsUseCase,
  insertVendorUseCase,
  selectOneVendorUseCase,
  updateVendorUseCase,
  deleteOneVendorUseCase,
} from '../../use-cases/vendors';

import { NotAllowedError } from '../../custom-errors';

import paginate from '../../pagination';

import { VendorDocument } from '../../lib/mongoose/models/vendor';
import { Connection } from '../../types';

const vendors = async (obj, args, ctx): Promise<Connection<VendorDocument>> => {
  if (!ctx.allowed) {
    throw new NotAllowedError('You are not allowed to access this resource');
  }

  const data = await selectAllVendorsUseCase({});

  return paginate({
    data,
    first: args.first,
    after: args.after,
  });
};
const vendor = async (obj, args, ctx): Promise<VendorDocument> => {
  if (!ctx.allowed) {
    throw new NotAllowedError('You are not allowed to access this resource');
  }
  return selectOneVendorUseCase({ id: args.id });
};

const createVendor = async (obj, args, ctx): Promise<boolean> => {
  if (!ctx.allowed) {
    throw new NotAllowedError('You are not allowed to access this resource');
  }

  return insertVendorUseCase({ info: args.input });
};
const updateVendor = async (obj, args, ctx): Promise<boolean> => {
  if (!ctx.allowed) {
    throw new NotAllowedError('You are not allowed to access this resource');
  }

  return updateVendorUseCase({
    id: args.input.id,
    info: args.input,
  });
};
const deleteVendor = async (obj, args, ctx): Promise<boolean> => {
  if (!ctx.allowed) {
    throw new NotAllowedError('You are not allowed to access this resource');
  }
  return deleteOneVendorUseCase({ id: args.id });
};

export { vendors, vendor, createVendor, updateVendor, deleteVendor };

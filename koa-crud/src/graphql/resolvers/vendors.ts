import {
  selectAllVendorsUseCase,
  insertVendorUseCase,
  selectOneVendorUseCase,
  updateVendorUseCase,
  deleteOneVendorUseCase,
} from '../../use-cases/vendors';

import { NotAllowedError } from '../../custom-errors';

import paginate from '../../pagination';

import { VendorDocument, Vendor } from '../../lib/mongoose/models/vendor';
import { Connection } from '../../types';
import { PaginateInput } from '../../pagination/paginate';

const vendors = async (
  parent: null,
  args: Omit<PaginateInput<VendorDocument>, 'data'>,
  ctx: { allowed: boolean; userId: { data: string } },
): Promise<Connection<VendorDocument>> => {
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
const vendor = async (
  parent: null,
  args: {
    id: string;
  },
  ctx: { allowed: boolean; userId: { data: string } },
): Promise<VendorDocument> => {
  if (!ctx.allowed) {
    throw new NotAllowedError('You are not allowed to access this resource');
  }
  return selectOneVendorUseCase({ id: args.id });
};

const createVendor = async (
  parent: null,
  args: {
    input: Pick<Vendor, 'name' | 'type'>;
  },
  ctx: { allowed: boolean; userId: { data: string } },
): Promise<boolean> => {
  if (!ctx.allowed) {
    throw new NotAllowedError('You are not allowed to access this resource');
  }

  return insertVendorUseCase({ info: args.input });
};
const updateVendor = async (
  parent: null,
  args: {
    input: {
      id: string;
    } & Pick<Vendor, 'name' | 'type'>;
  },
  ctx: { allowed: boolean; userId: { data: string } },
): Promise<boolean> => {
  if (!ctx.allowed) {
    throw new NotAllowedError('You are not allowed to access this resource');
  }

  return updateVendorUseCase({
    id: args.input.id,
    info: args.input,
  });
};
const deleteVendor = async (
  parent: null,
  args: {
    id: string;
  },
  ctx: { allowed: boolean; userId: { data: string } },
): Promise<boolean> => {
  if (!ctx.allowed) {
    throw new NotAllowedError('You are not allowed to access this resource');
  }
  return deleteOneVendorUseCase({ id: args.id });
};

export { vendors, vendor, createVendor, updateVendor, deleteVendor };

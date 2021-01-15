import {
  selectAllVendorsUseCase,
  insertVendorUseCase,
  selectOneVendorUseCase,
  updateVendorUseCase,
  deleteOneVendorUseCase,
} from '../../use-cases/vendors';

const vendors = async (obj, args, ctx) => {
  if (!ctx.allowed) {
    throw new Error('Forbidden');
  }
  return selectAllVendorsUseCase({ id: null, info: null, source: null });
};
const vendor = async (obj, args, ctx) => {
  if (!ctx.allowed) {
    throw new Error('Forbidden');
  }
  return selectOneVendorUseCase({ id: args.id, info: null, source: null });
};

const createVendor = async (obj, args, ctx) => {
  if (!ctx.allowed) {
    throw new Error('Forbidden');
  }

  return insertVendorUseCase({ id: null, info: args.input, source: null });
};
const updateVendor = async (obj, args, ctx) => {
  if (!ctx.allowed) {
    throw new Error('Forbidden');
  }

  return updateVendorUseCase({
    id: args.input.id,
    info: args.input,
    source: null,
  });
};
const deleteVendor = async (obj, args, ctx) => {
  if (!ctx.allowed) {
    throw new Error('Forbidden');
  }
  return deleteOneVendorUseCase({ id: args.id, info: null, source: null });
};

export { vendors, vendor, createVendor, updateVendor, deleteVendor };

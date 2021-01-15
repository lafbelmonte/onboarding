import {
  members,
  member,
  createMember,
  updateMember,
  deleteMember,
} from './members';

import {
  vendors,
  vendor,
  createVendor,
  updateVendor,
  deleteVendor,
} from './vendors';

import { createPromo } from './promos';

const Query = {
  members,
  member,
  vendors,
  vendor,
};
const Mutation = {
  createMember,
  updateMember,
  deleteMember,
  createVendor,
  updateVendor,
  deleteVendor,
  createPromo,
};

export default {
  Query,
  Mutation,
};

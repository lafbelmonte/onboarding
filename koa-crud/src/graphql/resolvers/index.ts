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

import { createPromo, promos, promo, updatePromo } from './promos';

const Query = {
  members,
  member,
  vendors,
  vendor,
  promos,
  promo,
};
const Mutation = {
  createMember,
  updateMember,
  deleteMember,
  createVendor,
  updateVendor,
  deleteVendor,
  createPromo,
  updatePromo,
};

export default {
  Query,
  Mutation,
};

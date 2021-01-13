import { Context } from 'koa';
import { Document } from 'mongoose';

type HttpRequest = {
  body;
  query;
  params;
  ip;
  method;
  path;
  headers;
};

type HttpResponse = {
  headers;
  statusCode;
  body;
};

type UseCase = ({ id, info, source }) => Promise<any>;

type Controller = (httpRequest: HttpRequest) => Promise<HttpResponse>;

type Serializer = (controller: Controller) => (ctx: Context) => Promise<void>;

enum VendorType {
  Seamless = 'SEAMLESS',
  Transfer = 'TRANSFER',
}

type Vendor = {
  _id?: string;
  name: string;
  type: VendorType;
};

type VendorDocument = Vendor & Document;

type VendorFilters = {
  _id?: string;
  name?: string;
  type?: string;
};

type VendorsStore = {
  insertOneVendor: (info: Vendor) => Promise<VendorDocument>;
  vendorExistsByFilter: (filters: VendorFilters) => Promise<boolean>;
  selectAllVendors: () => Promise<VendorDocument[]>;
  selectOneVendorByFilters: (filters: VendorFilters) => Promise<VendorDocument>;
  updateVendorByFilters: (
    filters: VendorFilters,
    info: Vendor,
  ) => Promise<VendorDocument>;
  deleteOneVendor: (filters: VendorFilters) => Promise<boolean>;
};

type Member = {
  _id?: string;
  username: string;
  password: string;
  realName?: string | null;
};

type MemberFilters = {
  _id?: string;
  username?: string;
  realName?: string;
};

type MemberDocument = Member & Document;

type MembersStore = {
  insertOneMember: (info: Member) => Promise<MemberDocument>;
  memberExistsByFilter: (filters: MemberFilters) => Promise<boolean>;
};

export {
  HttpRequest,
  HttpResponse,
  Vendor,
  VendorType,
  Serializer,
  Controller,
  UseCase,
  VendorDocument,
  VendorsStore,
  MemberDocument,
  Member,
  MembersStore,
};

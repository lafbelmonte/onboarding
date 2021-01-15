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

type UseCase<T> = ({ id, info, source }) => Promise<T>;

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
  insertOneVendor: (info: VendorDocument) => Promise<VendorDocument>;
  vendorExistsByFilter: (filters: VendorFilters) => Promise<boolean>;
  selectAllVendors: () => Promise<VendorDocument[]>;
  selectOneVendorByFilters: (filters: VendorFilters) => Promise<VendorDocument>;
  updateVendorByFilters: (
    filters: VendorFilters,
    info: VendorDocument,
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
  _id?: string | Record<string, any>;
  username?: string;
  realName?: string;
};

type MemberDocument = Member & Document;

type MembersStore = {
  insertOneMember: (info: MemberDocument) => Promise<MemberDocument>;
  memberExistsByFilter: (filters: MemberFilters) => Promise<boolean>;
  selectAllMembers: () => Promise<MemberDocument[]>;
  selectOneMemberByFilters: (filters: MemberFilters) => Promise<MemberDocument>;
  updateMemberByFilters: (
    filters: MemberFilters,
    info: MemberDocument,
  ) => Promise<MemberDocument>;
  deleteOneMember: (filters: MemberFilters) => Promise<boolean>;
};

enum PromoTemplate {
  Deposit = 'DEPOSIT',
  SignUp = 'SIGN_UP',
}

enum PromoStatus {
  Draft = 'DRAFT',
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

interface RequiredMemberFields {
  realName: string;
  email: string;
  bankAccount: string;
}

type Promo = {
  _id?: string;
  name: string;
  template: PromoTemplate;
  title: string;
  description: string;
  status: PromoStatus;
  minimumBalance?: number;
  requiredMemberFields?: RequiredMemberFields;
};

type PromoDocument = Promo & Document;

type PromosStore = {
  insertOnePromo: (info: PromoDocument) => Promise<PromoDocument>;
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
  PromoTemplate,
  PromoStatus,
  PromoDocument,
  PromosStore,
  Promo,
};

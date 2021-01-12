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

enum VendorType {
  Seamless = 'SEAMLESS',
  Transfer = 'TRANSFER',
}

type Vendor = {
  _id?: string;
  name: string;
  type: VendorType;
  dateTimeCreated: Date;
  dateTimeUpdated: Date;
};

type VendorDocument = Vendor & Document;

type Controller = (httpRequest: HttpRequest) => Promise<HttpResponse>;

type Serializer = (controller: Controller) => (ctx: Context) => Promise<void>;

type UseCase = ({ id, info, source }) => Promise<any>;

type VendorFilters = {
  _id?: string;
  name?: string;
  type?: string;
};

type VendorStore = {
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

export {
  HttpRequest,
  HttpResponse,
  Vendor,
  VendorType,
  Serializer,
  Controller,
  UseCase,
  VendorDocument,
  VendorStore,
};

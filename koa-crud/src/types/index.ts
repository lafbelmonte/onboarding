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
  _id: string;
  name: string;
  type: VendorType;
  dateTimeCreated: Date;
  dateTimeUpdated: Date;
};

type VendorDocument = Vendor & Document;

type Controller = (httpRequest: HttpRequest) => Promise<HttpResponse>;

type Serializer = (controller: Controller) => (ctx: Context) => Promise<void>;

type UseCase = ({ id, info, source }) => Promise<Record<string, any>>;

type Store = Record<string, any>;

type Entity = Record<string, any>;

export {
  HttpRequest,
  HttpResponse,
  Vendor,
  VendorType,
  Serializer,
  Controller,
  UseCase,
  VendorDocument,
  Store,
  Entity,
};

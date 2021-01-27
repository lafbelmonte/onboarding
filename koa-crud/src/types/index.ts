import { Context } from 'koa';

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

type Controller = (httpRequest: HttpRequest) => Promise<HttpResponse>;

type Serializer = (controller: Controller) => (ctx: Context) => Promise<void>;

type Edge<T> = {
  node: T;
  cursor: Buffer;
};

type Connection<T> = {
  totalCount: number;
  pageInfo: {
    endCursor: Buffer;
    hasNextPage: boolean;
  };
  edges: Edge<T>[];
};

export { HttpRequest, HttpResponse, Serializer, Controller, Connection, Edge };

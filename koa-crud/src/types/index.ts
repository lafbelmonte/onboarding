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

export { HttpRequest, HttpResponse, Vendor };
